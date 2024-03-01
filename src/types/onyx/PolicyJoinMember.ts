import type * as OnyxCommon from '@src/types/onyx/OnyxCommon';

type PolicyJoinMember = {
    /** Role of the user in the policy */
    policyID?: string;

    /** Email of the user inviting the new member */
    invitedEmail?: string;

    /**
     * Errors from api calls on the specific user
     * {<timestamp>: 'error message', <timestamp2>: 'error message 2'}
     */
    errors?: OnyxCommon.Errors;
};

export default PolicyJoinMember;
