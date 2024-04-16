import Editor from '@monaco-editor/react';
import { Button, Card, CardBody, CardFooter, Divider } from '@nextui-org/react';

export const QuickNote = () => {
    return (
        <Card >
            <CardBody>
            <Editor height="10vh" width={"700px"} 
                options={{minimap: {enabled: false}, lineNumbers: "off", scrollBeyondLastLine: false, wordWrap: "on"}}
                defaultLanguage="plaintext" defaultValue="// 在此处添加你的内容" />
            </CardBody>
            <Divider style={{marginLeft: 15, marginRight: 15}}/>
            <CardFooter>
                <div></div>
                <Button radius="full" size="sm">保存</Button>
            </CardFooter>
        </Card>
    );
}