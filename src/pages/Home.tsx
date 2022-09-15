import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, View, Text, Image } from 'react-native';
import { Popup } from 'react-native-windows';
import { useTheme } from '../hook/theme';
import LoadingIndicator from '../components/LoadingIndicator'
import Video from './Video'

const shields = [
    '韩国电影',
    '纪录片'
];

async function getVideos() {
    const url = 'https://code-in-life.netlify.app/flutter/videos.json'
    const response = await fetch(url)
    const json: { videos: Section[] } = await response.json()
    // const json = html.match(
    //     new RegExp('(?<=<script id="__NEXT_DATA__" type="application/json">).+?(?=</script>)', 'g')
    // )
    return json.videos.filter(
        ({ section }) => !shields.includes(section)
    );
}

const VideoContext = React.createContext<{
    video: Video | null;
    setVideo: (v: Video) => void;
} | null>(null)

function Home() {

    const [loading, setLoading] = useState(false)
    const [videoList, setVideoList] = useState<Section[]>([])
    const { backgroundColor } = useTheme()
    const [activeVideo, setActiveVideo] = useState<Video | null>(null)

    const getVideoList = async () => {
        setLoading(true)
        const videos = await getVideos()
        setVideoList(videos)
        setLoading(false)
    }

    useEffect(() => {
        getVideoList()
    }, [])

    const hideModal = () => {
        setActiveVideo(null)
    }

    return (
        <>
            {loading ? (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor,
                }}>
                    <LoadingIndicator />
                </View>
            ) : (
                <VideoContext.Provider value={{
                    video: activeVideo,
                    setVideo: video => setActiveVideo(video)
                }}>
                    <ScrollView style={{ flex: 1, backgroundColor }} contentInsetAdjustmentBehavior="automatic">
                        {
                            videoList.map(
                                (section, index) => (
                                    <VideoSection key={index} section={section} />
                                )
                            )
                        }
                    </ScrollView>
                </VideoContext.Provider>
            )}
            <Popup style={{
                width: '100%',
                height: '100%',
            }} isOpen={Boolean(activeVideo)} onDismiss={hideModal}>
                {
                    activeVideo && <Video data={activeVideo} onDismiss={hideModal} />
                }
            </Popup>
        </>
    )
}

function VideoSection({ section }: { section: Section }) {
    const { paperColor } = useTheme();
    return (
        <View style={{
            margin: 5,
            backgroundColor: paperColor,
            borderRadius: 5
        }}>
            <View style={{
                padding: 10
            }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'purple'
                }}>{section.section}</Text>
            </View>
            <ScrollView style={{
                paddingHorizontal: 10
            }} contentInsetAdjustmentBehavior="automatic">
                {
                    section.series.map(
                        (video, index) => (
                            <VideoCollection key={index} video={video} />
                        )
                    )
                }
            </ScrollView>
        </View>
    )
}

function VideoCollection({ video }: { video: Video }) {
    const { textColor, borderColor } = useTheme();
    return (
        <VideoContext.Consumer>
            {
                context => (
                    <Pressable onPress={() => context?.setVideo(video)}>
                        <View style={{
                            paddingVertical: 10,
                            paddingHorizontal: 5,
                            borderTopWidth: 1,
                            borderTopColor: borderColor,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: textColor }}>{video.title}</Text>
                                {'episodes' in video && <Text style={{ color: '#999' }}>{video.episodes}集</Text>}
                            </View>
                            <View>
                                <Image style={{
                                    resizeMode: 'center',
                                    width: 24,
                                    height: 24
                                }} source={require('../assets/arrow-right.png')} />
                            </View>
                        </View>
                    </Pressable>
                )
            }
        </VideoContext.Consumer>
    )
}

export default Home;
