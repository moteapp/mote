import { DocumentModel } from '@mote/base/dist/model/documentModel';
import { PaginatedDocumentList } from 'mote/components/document/PaginatedDocumentList';
import { ThemedText } from 'mote/components/ThemedText';
import { ThemedSafeAreaView, ThemedView } from 'mote/components/ThemedView';

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
            <ThemedView style={{flex:1, paddingLeft: 20, paddingRight: 20 }}>
                <ThemedText type="title">主页</ThemedText>
                <PaginatedDocumentList documents={documentList} />
            </ThemedView>
        </ThemedSafeAreaView>
    );
}
