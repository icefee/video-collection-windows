import React from 'react';
import { ActivityIndicator } from 'react-native-windows';

export default function LoadingIndicator({ color = 'purple', size = 50 }) {
    return (
        <ActivityIndicator color={color} size="large" />
    )
}
