import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, TouchableHighlight, Text, Image, Dimensions } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import { useTheme } from '../hook/theme';

export const getM3u8Uri: (url_template: string, m3u8: M3u8Video) => string = (url_template, m3u8) => {
    if (typeof m3u8 === 'string') {
        return m3u8
    }
    else {
        return m3u8.reduce(
            (prev, current, i) => {
                return String(prev).replace(new RegExp('\\{' + i + '\\}', 'g'), String(current))
            },
            url_template
        ) as string
    }
}

function Video({ data, onDismiss }: { data: Video; onDismiss: () => void; }) {

    const { paperColor, textColor, backImageAsset } = useTheme()
    const [activeEpisode, setActiveEpisode] = useState(0)

    const videoInfo = useMemo<Video>(
        () => data,
        [data]
    )
    const isEpisode = useMemo<boolean>(
        () => 'episodes' in videoInfo,
        [videoInfo]
    )

    const [videoWidth, videoHeight] = useMemo(() => {
        const { width, height } = Dimensions.get('window')
        return [
            width,
            height * .4
        ]
    }, [])

    const playingUrl = useMemo<string>(() => {
        if (isEpisode) {
            const video = videoInfo as Episode;
            return getM3u8Uri(video.url_template!, video.m3u8_list[activeEpisode])
        }
        else {
            return (videoInfo as Film).m3u8_url
        }
    }, [activeEpisode])

    const playNext = () => {
        if (isEpisode) {
            if (activeEpisode < (videoInfo as Episode).episodes - 1) {
                setActiveEpisode(
                    prevEpisode => prevEpisode + 1
                )
            }
        }
    }

    /*
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            if (!isFullscreen) {
                return;
            }
            else {
                e.preventDefault()
                setIsFullscreen(false)
            }
        })
    }, [isFullscreen, navigation])
    */

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: paperColor,
                padding: 5
            }}>
                <TouchableWithoutFeedback onPress={onDismiss}>
                    <Image style={{
                        width: 25,
                        height: 25,
                        resizeMode: 'center'
                    }} source={backImageAsset} />
                </TouchableWithoutFeedback>
                <View style={{
                    padding: 10,
                    marginLeft: 10
                }}>
                    <Text style={{ color: textColor }}>{videoInfo.title}</Text>
                </View>
            </View>
            <VideoPlayer
                width={videoWidth}
                height={videoHeight}
                url={playingUrl}
                onEnd={playNext}
            />
            <View style={{ flex: 1, backgroundColor: paperColor }}>
                <View style={{
                    padding: 10
                }}>
                    <Text style={{ color: textColor }}>选集</Text>
                </View>
                {
                    isEpisode ? (
                        <ScrollView contentInsetAdjustmentBehavior="automatic">
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}>
                                {
                                    (videoInfo as Episode).m3u8_list.map(
                                        (m3u8, index) => (
                                            <EpisodeSelection
                                                key={index}
                                                active={activeEpisode === index}
                                                onPress={
                                                    () => setActiveEpisode(index)
                                                }
                                            >第{index + 1}集</EpisodeSelection>
                                        )
                                    )
                                }
                            </View>
                        </ScrollView>
                    ) : (
                        <View style={{
                            padding: 10
                        }}>
                            <Text>暂无</Text>
                        </View>
                    )
                }
            </View>
        </View>
    )
}

function EpisodeSelection({ active, children, onPress }: { active: boolean, children: React.ReactNode, onPress: () => void }) {

    const { textColor } = useTheme()

    const viewStyle = {
        borderColor: textColor,
        backgroundColor: active ? 'purple' : 'transparent'
    }

    const textStyle = {
        color: textColor
    }

    return (
        <View style={{
            width: '20%',
            padding: 5
        }}>
            <TouchableHighlight underlayColor="purple" style={{
                borderWidth: 2,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                ...viewStyle
            }} onPress={onPress}>
                <Text style={{ ...textStyle }}>{children}</Text>
            </TouchableHighlight>
        </View>
    )
}

export default Video;
