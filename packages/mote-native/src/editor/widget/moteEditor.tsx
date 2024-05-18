import { ICommandDelegate, ViewController } from "@mote/editor/browser/view/viewController";
import { BlockModel } from "@mote/editor/common/model/blockModel";
import { RecordModel } from "@mote/editor/common/model/recordModel";
import { IRecordProvider, ISegment } from "@mote/editor/common/recordCommon";
import { ViewModel } from "@mote/editor/common/viewModel/viewModel";
import { EditorHead } from "mote/editor/widget/editorHead";
import { Document } from "mote/editor/widget/document";
import { recordService } from "mote/workbench/service/record/common/recordService";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from "react-native";
import { URI } from "vs/base/common/uri";
import { generateUuid } from "vs/base/common/uuid";

export interface IMoteEditorProps {
    resource?: URI;
}

export const MoteEditor = (props: IMoteEditorProps) => {

    const recordProvider: IRecordProvider = {
        provideRecord: (uri: URI) => { 
            return recordService.getRecord(uri)!;
        }
    }

    const resource = props.resource ? props.resource : URI.from({scheme: 'record', authority: 'block', path: '/'+generateUuid()});
    const pageModel = new BlockModel(resource, recordProvider);
    const viewModel = new ViewModel(pageModel, recordService);

    const commandDelegate: ICommandDelegate = {
        type: (text: string, model: RecordModel<ISegment[]>) => viewModel.type(text, model),
        lineBreak: (model: RecordModel<ISegment[]>) => viewModel.lineBreak(model),
        getSelection: () => viewModel.selection,
    } as any;

    const viewController = new ViewController(viewModel, commandDelegate);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex:1, paddingTop: 20, justifyContent: 'space-between', backgroundColor: 'white'}}
        >
            <ScrollView>
                <View style={{ paddingLeft: 20, paddingRight: 20,}}>
                    <EditorHead model={pageModel.getTitleModel()} viewController={viewController}/>
                    <Document model={pageModel} viewController={viewController}/>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}