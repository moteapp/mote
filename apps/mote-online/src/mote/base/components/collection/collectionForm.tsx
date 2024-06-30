import { Text } from 'mote/base/components/text';
import { Trans, useTranslation } from 'react-i18next';
import Flex from '../flex';
import { Input } from '../input/input';
import { Button } from '../buttton/button';
import { useForm } from 'react-hook-form';

export interface CollectionFormData {
    name: string;
}

export interface ICollectionFormProps {
    handleSubmit: (data: CollectionFormData) => void;
}

export const CollectionForm = ({
    handleSubmit
} : ICollectionFormProps) => {

    const { t } = useTranslation();

    const {register, handleSubmit: formHandleSubmit} = useForm<CollectionFormData>({
        mode: 'all',
        defaultValues: {
            name: ''
        }
    });
    
    return (
        <form onSubmit={formHandleSubmit(handleSubmit)}>
            <Text as="p">
                <Trans>
                Collections are used to group documents and choose permissions
                </Trans>
                .
            </Text>
            <Flex $gap={8}>
                <Input
                    type="text"
                    autoFocus
                    flex
                    placeholder={t("Name")}
                    {...register("name", {
                        required: true,
                        maxLength: 30,
                    })}
                />
            </Flex>
            <Flex justify="flex-end">
                <Button type="submit">
                    {t("Save")}
                </Button>
            </Flex>
        </form>
    )
}