import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import Spacer from "../Spacer";
import { Form, useNavigation } from "@remix-run/react";
import Input from "../Input";
import { Button } from "../ui/button";

export default function DeleteModal({
  id,
  title,
  description,
  isOpen,
  closeModal,
}: {
  id: string;
  title: string;
  description: string;
  isOpen: boolean;
  closeModal: () => void;
}) {
  let navigation = useNavigation();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 " onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4 text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-slate-900 dark:text-white"
                >
                  {title}
                </Dialog.Title>
                <div className="h-4"></div>

                <Form method="POST" encType="multipart/form-data">
                  <Input name="deleteId" type="hidden" defaultValue={id} />

                  <p className="dark:text-white">{description}</p>

                  <Spacer />

                  <div className="flex items-center ">
                    <Button
                      type="button"
                      className="ml-auto mr-3"
                      onClick={closeModal}
                      variant="destructive"
                    >
                      Close
                    </Button>

                    <Button
                      type="submit"
                      disabled={
                        navigation.state === "submitting" ? true : false
                      }
                    >
                      {navigation.state === "submitting"
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  </div>
                </Form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
