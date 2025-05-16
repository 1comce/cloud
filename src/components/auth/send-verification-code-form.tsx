"use client";

import {
  ArrowRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { handleSendEmailVerificationCode } from "@/lib/cognitoActions";
import { useActionState } from "react";
import { Button } from "../button";

export default function SendVerificationCode() {
  const [response, formAction, isPending] = useActionState(
    handleSendEmailVerificationCode,
    {
      message: "",
      errorMessage: "",
    }
  );
  return (
    <>
      <Button
        className='mt-4 w-full'
        aria-disabled={isPending}
        formAction={formAction}
      >
        Resend Verification Code{" "}
        <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
      </Button>
      <div className='flex h-8 items-end space-x-1'>
        <div
          className='flex h-8 items-end space-x-1'
          aria-live='polite'
          aria-atomic='true'
        >
          {response?.errorMessage && (
            <>
              <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
              <p className='text-sm text-red-500'>{response.errorMessage}</p>
            </>
          )}
          {response?.message && (
            <p className='text-sm text-green-500'>{response.message}</p>
          )}
        </div>
      </div>
    </>
  );
}
