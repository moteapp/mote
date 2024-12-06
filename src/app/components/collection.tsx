'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CollectionSchema, ICollectionSchema } from "mote/platform/request/common/collection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useClientTranslation } from "../lib/i18nForClient";
import { Switch } from "./ui/switch";
import { useAppSelector } from "../store/hooks";
import { selectSpace } from "../store/features/auth/authSlice";
import { requestService } from "mote/platform/request/common/requestService";
import { createCollectionAction } from "../actions/actions";

export type CollectionFormProps = {
    submitButton?: React.ReactNode;
    onSubmitAction: (values: ICollectionSchema) => void;
};

export function CollectionForm({
    submitButton,
    onSubmitAction,
} : CollectionFormProps) {
    const { t } = useClientTranslation();
    const space = useAppSelector(selectSpace)!;

    // 1. Define your form.
    const form = useForm<ICollectionSchema>({
        resolver: zodResolver(CollectionSchema),
        defaultValues: {
            name: "",
            permission: undefined,
            sharing: true,
            spaceId: space.id,
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: ICollectionSchema) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        await requestService.createCollection(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitAction)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder={t("Name")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="permission"
                    render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("No access")} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="view">{t("View only")}</SelectItem>
                                    <SelectItem value="comment">{t("Can comment")}</SelectItem>
                                    <SelectItem value="edit">{t("Can edit")}</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                {t("The default access for workspace members, you can share with more users or groups later.")}
                            </FormDescription>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="sharing"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between ">
                            <div className="space-y-0.5">
                                <FormLabel>{t("Public document sharing")}</FormLabel>
                                <FormDescription>
                                    {t("Allow documents within this collection to be shared publicly on the internet.")}
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-readonly
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                { submitButton ? submitButton : <Button type="submit">{t("Create")}</Button>}
            </form>
        </Form>
    );
}
