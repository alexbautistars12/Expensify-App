import React, {Component} from 'react';
import lodashGet from 'lodash/get';
import BaseOnfido from './BaseOnfido';
import onfidoPropTypes from './onfidoPropTypes';

class Onfido extends Component {
    constructor(props) {
        super(props);
        this.baseOnfido = null;
    }

    componentWillUnmount() {
        const onfidoOut = lodashGet(this, 'baseOnfido.onfidoOut');
        if (!onfidoOut) {
            return;
        }

        onfidoOut.tearDown();
    }

    render() {
        return (
            <BaseOnfido
                ref={e => this.baseOnfido = e}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...this.props}
            />
        );
    }
}

Onfido.propTypes = onfidoPropTypes;

export default Onfido;
