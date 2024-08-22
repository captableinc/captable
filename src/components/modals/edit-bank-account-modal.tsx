"use client";

import Modal from "@/components/common/push-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BankAccountTypeEnum } from "@/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { ConfirmDialog } from "../common/confirmDialog";
import { useState } from "react";


type AddBankAccountType = {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  data: any
};

type PrimarySwitchedTypeEnum = "null" | "primarySwitchedToTrue" | "primarySwitchedToFalse"


const formSchema = z
  .object({
    id: z.string().min(1),
    beneficiaryName: z.string().min(1, {
      message: "Beneficiary Name is required",
    }),
    beneficiaryAddress: z.string().min(1, {
      message: "Beneficiary Address is required",
    }),
    bankName: z.string().min(1, {
      message: "Bank Name is required",
    }),
    bankAddress: z.string().min(1, {
      message: "Bank Address is required",
    }),
    accountNumber: z.string().min(1, {
      message: "Account Number is required",
    }),
    routingNumber: z.string().min(1, {
      message: "Routing Number is required",
    }),
    confirmRoutingNumber: z.string().min(1, {
      message: "Confirm Routing Number is required",
    }),
    accountType: z.nativeEnum(BankAccountTypeEnum).default("CHECKING"),
    primary: z.boolean().default(false),
    primarySwitched: z.enum(["null", "primarySwitchedToTrue", "primarySwitchedToFalse"]).default("null")
  })
  .refine((data) => data.routingNumber === data.confirmRoutingNumber, {
    path: ["confirmRoutingNumber"],
    message: "Routing Number does not match",
  });

type TFormSchema = z.infer<typeof formSchema>;

export const EditBankAccountModal = ({ title, subtitle, data }: AddBankAccountType) => {

  const router = useRouter();
  const pathname = usePathname();
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [primarySwitched, setPrimarySwitch] = useState<PrimarySwitchedTypeEnum>("null");
  const form: UseFormReturn<TFormSchema> = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id,
      beneficiaryName: data?.beneficiaryAddress,
      beneficiaryAddress: data?.beneficiaryAddress,
      bankName: data?.bankName,
      bankAddress: data?.bankAddress,
      accountNumber: data?.accountNumber,
      routingNumber: data?.routingNumber,
      confirmRoutingNumber: "",
      accountType: data?.accountType,
      primary: data?.primary,
      primarySwitched: "null",
    },
  });

  const { mutateAsync: handleUpdateBankAccount, isLoading, isSuccess } =
    api.bankAccounts.updateBankAccount.useMutation({
      onSuccess: ({message}) => {
        toast.success(message)
        router.refresh()
      },

      onError: (error) => {
        console.log("Error updating Bank Account", error);
        toast.error("An error occurred while updating bank account.");
      },
    });

  const handleEnableSwitch = () => {
    setSwitchEnabled(true)
  }

  const handleSetPrimary = (e: boolean) => {

    if (data?.primary) {
      setPrimarySwitch("primarySwitchedToFalse");
    } else {
      setPrimarySwitch("primarySwitchedToTrue");
    }
    form.setValue("primary", e)
    
    
  }

  const handleFormSubmit = async (data: TFormSchema) => {
    try {
      data = {...data, primarySwitched: primarySwitched}

      await handleUpdateBankAccount(data);
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/${pathname}`
    } catch (error) {
      console.log("Error creating Bank Account", error);
    }
  };

  return (
    <Modal size="xl" title={title} subtitle={subtitle}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="beneficiaryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beneficiary Name</FormLabel>
                    <FormControl>
                      <Input {...field} required  />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="beneficiaryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beneficiary Address</FormLabel>
                    <FormControl>
                      <Input {...field} required  />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input {...field} required  />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="bankAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Address</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex-1">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      required
                      type="number"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Routing Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        type="number"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="confirmRoutingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Routing Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        required
                        type="number"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="CHECKING"
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px] md:w-[200px]">
                          <SelectValue placeholder="Select Account Type" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Account Type</SelectLabel>
                          <SelectItem value="CHECKING">
                            CHECKING ACCOUNT
                          </SelectItem>
                          <SelectItem value="SAVINGS">
                            SAVINGS ACCOUNT
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="primary"
                render={({ field }) => (
                  <FormItem className="flex justify-center items-center">
                    <FormLabel className="pr-2">Primary Account</FormLabel>
                    <FormControl>
                      <>
                        <ConfirmDialog title="Edit Primary/ Secondary" 
                          body={`Please note that other primary/secondary account will be set as secondary/primary, are you sure you want to proceed?`} 
                          trigger={ 
                            !switchEnabled && <Switch
                            id="is-primary"
                            className="mt-0"
                            onCheckedChange={(e) => form.setValue("primary", e)}
                            defaultChecked={data?.primary}
                          />
                          } 
                          onConfirm={handleEnableSwitch} 
                        />

                        { 
                        switchEnabled 
                          && 
                          <Switch
                            id="is-primary"
                            className="mt-0"
                            disabled={!switchEnabled}
                            onCheckedChange={(e) => handleSetPrimary(e)}
                            defaultChecked={data?.primary}
                          />
                        }
                      </>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
            <Button type="submit">Update</Button>
          
        </form>
      </Form>

      
    </Modal>
  );
};
