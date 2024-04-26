"use client";

import { TagsInput } from "@ark-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiClipboardLine, RiCloseLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { generatePublicId } from "@/common/id";
import { CaptableLogo } from "@/components/common/logo";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  DocumentShareMutationSchema,
  type TypeDocumentShareMutation,
} from "@/trpc/routers/document-share-router/schema";
import { useEffect } from "react";

type DocumentShareModalProps = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  open: boolean;
  documentId: string | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = DocumentShareMutationSchema;

const DocumentShareModal = ({
  open,
  setOpen,
  size,
  title,
  subtitle,
  documentId,
}: DocumentShareModalProps) => {
  const publicId = generatePublicId();
  const form = useForm<TypeDocumentShareMutation>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkExpiresAt: new Date(),
      link: `http://localhost:3000/document/${publicId}`, // TODO: generate a link
      emailProtected: true,
      publicId,
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    if (documentId) {
      form.setValue("documentId", documentId);
    }
  }, [documentId, form]);

  const { mutateAsync } = api.documentShare.create.useMutation({
    onSuccess: async ({ success, message }) => {
      toast({
        variant: success ? "default" : "destructive",
        title: success
          ? "🎉 Successfully created"
          : "Uh oh! Something went wrong.",
        description: message,
      });

      form.reset();
      setOpen(false);
      router.refresh();
    },
  });
  const router = useRouter();

  const onSubmit = async (values: TypeDocumentShareMutation) => {
    await mutateAsync(values);

    form.reset();
    router.refresh();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "mb-10 mt-10 gap-0 bg-white p-0",
          size === "sm" && "sm:max-w-sm",
          size === "md" && "sm:max-w-md",
          size === "lg" && "sm:max-w-lg",
          size === "xl" && "sm:max-w-xl",
          size === "2xl" && "sm:max-w-2xl",
        )}
      >
        <div className="no-scrollbar max-h-[80vh] overflow-scroll">
          <header className="border-b border-gray-200 p-5">
            <div className="">
              <DialogHeader>
                <div className="flex justify-center">
                  <CaptableLogo className="mb-3 h-10 w-10" />
                </div>
                <DialogTitle className="mb-4 text-center">{title}</DialogTitle>
                <DialogDescription className="text-center">
                  {subtitle}
                </DialogDescription>
              </DialogHeader>
            </div>
          </header>

          <section className=" bg-gray-100 px-8 py-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6 md:col-span-2">
                  <div className="relative flex items-center gap-2 sm:col-span-6">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>

                            <FormMessage className="text-xs font-light" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center">
                      <button
                        type="button"
                        className="inine-block rounded border p-2"
                      >
                        <RiClipboardLine />
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-full">
                    <FormField
                      control={form.control}
                      name="linkExpiresAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link Expires At (optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value
                                  ? new Date(field.value)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-light" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="my-4 sm:col-span-full">
                  <TagsInput.Root
                    className="flex flex-col space-y-2"
                    max={3}
                    allowOverflow
                    defaultValue={[]}
                  >
                    {(api) => (
                      <>
                        <TagsInput.Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Recipients (optional)
                        </TagsInput.Label>
                        <TagsInput.Control className="flex min-w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          {api.value.map((value, index) => (
                            <TagsInput.Item
                              key={index}
                              index={index}
                              value={value}
                            >
                              <TagsInput.ItemPreview className="inline-flex items-center rounded-md border px-1 py-0.5 text-xs">
                                <TagsInput.ItemText>{value}</TagsInput.ItemText>
                                <TagsInput.ItemDeleteTrigger className="ml-0.5">
                                  <RiCloseLine className="h-4 w-4" />
                                </TagsInput.ItemDeleteTrigger>
                              </TagsInput.ItemPreview>
                            </TagsInput.Item>
                          ))}

                          <TagsInput.Input
                            placeholder="Add Recipients"
                            className="border-none bg-transparent outline-none"
                          />
                        </TagsInput.Control>
                      </>
                    )}
                  </TagsInput.Root>
                </div>
                <div className="mt-8 flex justify-between">
                  <FormField
                    control={form.control}
                    name="emailProtected"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel className="order-last">
                            Require Email Protection
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button loadingText="Submitting..." type="submit">
                    Share document
                  </Button>
                </div>
              </form>
            </Form>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentShareModal;
