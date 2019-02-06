import React from 'react';
import {BorderlessButton} from 'react-native-gesture-handler';

function CustomButton(props) {
    let componentProps;

    if (props.disabled) {
        const {onPress, ...propsWithoutPress} = props;
        componentProps = {...propsWithoutPress};
    } else {
        componentProps = {...props};
    }

    return (
        <BorderlessButton
            {...componentProps}
            rippleColor={props.disabled ? 'transparent' : props.rippleColor}
        >
            {props.children}
        </BorderlessButton>
    )
}

export {CustomButton}
