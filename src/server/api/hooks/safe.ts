import { useMutation } from "@tanstack/react-query";
import { createSafe } from "../client-handlers/safe";

export const useCreateSafeMutation = () => useMutation(createSafe);
