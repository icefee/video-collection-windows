import React, { useState, useEffect, useRef } from 'react';
import { View, Text, AppState, type AppStateStatus } from 'react-native';
import Video from 'react-native-video';
import { FadeView } from './Animated';
import LoadingIndicator from './LoadingIndicator';
import { useBitSize } from '../hook/byteSize';

interface VideoPlayerProps {
    url: string;
    width: number;
    height: number;
    onRequestFullscreen?: () => void;
    onEnd?: () => void;
}

function VideoPlayer({ url, width, height, onEnd }: VideoPlayerProps) {

    const [paused, setPaused] = useState(false)

    const appState = useRef(AppState.currentState);

    const _handleAppStateChange = (state: AppStateStatus) => {
        if (
            appState.current.match(/inactive|background|active/) &&
            state === 'active'
        ) {
            setPaused(false);
        }
        else {
            setPaused(true);
        }
        appState.current = state;
    }

    useEffect(() => {

        const listener = AppState.addEventListener('change', _handleAppStateChange);

        return () => listener.remove();
    }, []);

    return (
        <View style={{
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        }}>
            <Video
                source={{ uri: url }}
                minLoadRetryCount={20}
                resizeMode="contain"
                paused={paused}
                controls
                onEnd={onEnd}
                style={{ width, height }}
            />
        </View>
    )
}

export default VideoPlayer;