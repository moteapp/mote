import { DocumentModel } from '@mote/base/dist/model/documentModel';
import { ThemedView } from 'mote/components/ThemedView';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from 'mote/hooks/useThemeColor';

export type DocumentCardProps = {
    document: DocumentModel;
    style?: any;
};

export function DocumentCard({ document, style }: DocumentCardProps) {
    const borderColor = useThemeColor({}, 'border');

    return (
        <ThemedView
            style={{
                padding: 10,
                marginTop: 10,
                borderWidth: 1,
                width: '47%',
                minHeight: 210,
                borderRadius: 10,
                borderColor,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,

                elevation: 2,
            }}
        >
            <ThemedText>{document.id}</ThemedText>
        </ThemedView>
    );
}
