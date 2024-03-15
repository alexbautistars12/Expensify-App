import type {StackScreenProps} from '@react-navigation/stack';
import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import ConfirmModal from '@components/ConfirmModal';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import * as Expensicons from '@components/Icon/Expensicons';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import OfflineWithFeedback from '@components/OfflineWithFeedback';
import ScreenWrapper from '@components/ScreenWrapper';
import Switch from '@components/Switch';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import useWindowDimensions from '@hooks/useWindowDimensions';
import {clearTaxRateFieldError, deletePolicyTaxes, setPolicyTaxesEnabled} from '@libs/actions/TaxRate';
import * as ErrorUtils from '@libs/ErrorUtils';
import Navigation from '@libs/Navigation/Navigation';
import type {SettingsNavigatorParamList} from '@libs/Navigation/types';
import * as PolicyUtils from '@libs/PolicyUtils';
import NotFoundPage from '@pages/ErrorPage/NotFoundPage';
import AdminPolicyAccessOrNotFoundWrapper from '@pages/workspace/AdminPolicyAccessOrNotFoundWrapper';
import PaidPolicyAccessOrNotFoundWrapper from '@pages/workspace/PaidPolicyAccessOrNotFoundWrapper';
import type {WithPolicyAndFullscreenLoadingProps} from '@pages/workspace/withPolicyAndFullscreenLoading';
import withPolicyAndFullscreenLoading from '@pages/workspace/withPolicyAndFullscreenLoading';
import ROUTES from '@src/ROUTES';
import type SCREENS from '@src/SCREENS';

type WorkspaceEditTaxPageBaseProps = WithPolicyAndFullscreenLoadingProps & StackScreenProps<SettingsNavigatorParamList, typeof SCREENS.WORKSPACE.TAXES_EDIT>;

function WorkspaceEditTaxPage({
    route: {
        params: {policyID, taxID},
    },
    policy,
}: WorkspaceEditTaxPageBaseProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const currentTaxRate = PolicyUtils.getTaxByID(policy, taxID);
    const {windowWidth} = useWindowDimensions();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const toggle = () => {
        if (!policy?.id || !currentTaxRate) {
            return;
        }
        setPolicyTaxesEnabled(policy.id, [taxID], !!currentTaxRate?.isDisabled);
    };

    const deleteTax = () => {
        if (!policy?.id) {
            return;
        }
        deletePolicyTaxes(policy?.id, [taxID]);
        setIsDeleteModalVisible(false);
        Navigation.goBack();
    };

    const threeDotsMenuItems = useMemo(() => {
        const menuItems = [
            {
                icon: Expensicons.Trashcan,
                text: translate('common.delete'),
                onSelected: () => setIsDeleteModalVisible(true),
            },
        ];
        return menuItems;
    }, [translate]);

    if (!currentTaxRate) {
        return <NotFoundPage />;
    }

    return (
        <AdminPolicyAccessOrNotFoundWrapper policyID={policyID}>
            <PaidPolicyAccessOrNotFoundWrapper policyID={policyID}>
                <ScreenWrapper
                    testID={WorkspaceEditTaxPage.displayName}
                    style={styles.mb5}
                >
                    <View style={[styles.h100, styles.flex1, styles.justifyContentBetween]}>
                        <View>
                            <HeaderWithBackButton
                                title={currentTaxRate?.name}
                                threeDotsMenuItems={threeDotsMenuItems}
                                shouldShowThreeDotsButton
                                threeDotsAnchorPosition={styles.threeDotsPopoverOffsetNoCloseButton(windowWidth)}
                            />
                            <OfflineWithFeedback
                                errors={ErrorUtils.getLatestErrorField(currentTaxRate, 'isDisabled')}
                                pendingAction={currentTaxRate?.pendingFields?.isDisabled}
                                errorRowStyles={styles.mh5}
                                onClose={() => clearTaxRateFieldError(policyID, taxID, 'isDisabled')}
                            >
                                <View style={[styles.mt2, styles.mh5]}>
                                    <View style={[styles.flexRow, styles.mb5, styles.mr2, styles.alignItemsCenter, styles.justifyContentBetween]}>
                                        <Text>{translate('workspace.taxes.actions.enable')}</Text>
                                        <Switch
                                            isOn={!currentTaxRate?.isDisabled}
                                            accessibilityLabel={translate('workspace.taxes.actions.enable')}
                                            onToggle={toggle}
                                        />
                                    </View>
                                </View>
                            </OfflineWithFeedback>
                            <OfflineWithFeedback
                                errors={ErrorUtils.getLatestErrorField(currentTaxRate, 'name')}
                                pendingAction={currentTaxRate?.pendingFields?.name}
                                errorRowStyles={styles.mh5}
                                onClose={() => clearTaxRateFieldError(policyID, taxID, 'name')}
                            >
                                <MenuItemWithTopDescription
                                    shouldShowRightIcon
                                    title={currentTaxRate?.name}
                                    description={translate('common.name')}
                                    style={[styles.moneyRequestMenuItem]}
                                    titleStyle={styles.flex1}
                                    onPress={() => Navigation.navigate(ROUTES.WORKSPACE_TAXES_NAME.getRoute(`${policy?.id}`, taxID))}
                                />
                            </OfflineWithFeedback>
                            <OfflineWithFeedback
                                errors={ErrorUtils.getLatestErrorField(currentTaxRate, 'value')}
                                pendingAction={currentTaxRate?.pendingFields?.value}
                                errorRowStyles={styles.mh5}
                                onClose={() => clearTaxRateFieldError(policyID, taxID, 'value')}
                            >
                                <MenuItemWithTopDescription
                                    shouldShowRightIcon
                                    title={currentTaxRate?.value}
                                    description={translate('workspace.taxes.value')}
                                    style={[styles.moneyRequestMenuItem]}
                                    titleStyle={styles.flex1}
                                    onPress={() => Navigation.navigate(ROUTES.WORKSPACE_TAXES_VALUE.getRoute(`${policy?.id}`, taxID))}
                                />
                            </OfflineWithFeedback>
                        </View>
                    </View>
                    <ConfirmModal
                        title={translate('workspace.taxes.actions.delete')}
                        isVisible={isDeleteModalVisible}
                        onConfirm={deleteTax}
                        onCancel={() => setIsDeleteModalVisible(false)}
                        prompt={translate('workspace.taxes.deleteTaxConfirmation')}
                        confirmText={translate('common.delete')}
                        cancelText={translate('common.cancel')}
                        danger
                    />
                </ScreenWrapper>
            </PaidPolicyAccessOrNotFoundWrapper>
        </AdminPolicyAccessOrNotFoundWrapper>
    );
}

WorkspaceEditTaxPage.displayName = 'WorkspaceEditTaxPage';

export default withPolicyAndFullscreenLoading(WorkspaceEditTaxPage);
