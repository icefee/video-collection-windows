import { useColorScheme, type ImageSourcePropType } from 'react-native';

interface ThemeColor {
    backgroundColor: string;
    viewColor: string;
    paperColor: string;
    borderColor: string;
    textColor: string;
    headerColor: string;
    statusBarColor: string;
    backImageAsset: ImageSourcePropType;
}

export function useTheme(): ThemeColor {
    const theme = useColorScheme();
    if (theme === 'dark') {
        return {
            backgroundColor: '#000',
            viewColor: '#000',
            paperColor: '#222',
            borderColor: '#444',
            textColor: '#fff',
            headerColor: '#666',
            statusBarColor: '#222',
            backImageAsset: require('../assets/back_light.png')
        }
    }
    else {
        return {
            backgroundColor: '#eee',
            viewColor: '#fff',
            paperColor: '#fff',
            borderColor: '#eee',
            textColor: '#000',
            headerColor: '#fff',
            statusBarColor: '#f3f3f3',
            backImageAsset: require('../assets/back_dark.png')
        }
    }
}
