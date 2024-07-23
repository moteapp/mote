import { DocumentModel } from '@mote/base/dist/model/documentModel';
import { PaginatedDocumentList } from 'mote/components/document/PaginatedDocumentList';
import { ThemedText } from 'mote/components/ThemedText';
import { ThemedSafeAreaView, ThemedView } from 'mote/components/ThemedView';
import { WebView } from 'react-native-webview';

const documentList: DocumentModel[] = [
    {
        id: '1',
        data: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Hello, world!',
                            content: [],
                        },
                    ],
                },
            ],
        },
    },
    {
        id: '2',
        data: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Goodbye, world!',
                            content: [],
                        },
                    ],
                },
            ],
        },
    },
    {
        id: '3',
        data: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Goodbye, world!',
                            content: [],
                        },
                    ],
                },
            ],
        },
    },
];

export default function HomeScreen() {
    return (
        <ThemedSafeAreaView style={{ flex: 1 }}>
            <WebView
                source={{ uri: 'https://app.mote.dev/home' }}
                style={{ flex: 1 }}
            />
        </ThemedSafeAreaView>
    );
}
