"use client";

import React, { useActionState, useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { sendFeedback } from "@/app/action/feedback-action";

interface Feedback {
  id: string;
  feedback: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

interface FeedbackClientProps {
  feedbacks: Feedback[];
}

export default function FeedbackClient({ feedbacks }: FeedbackClientProps) {
  const [state, formAction, isPending] = useActionState(sendFeedback, { 
    error: undefined, 
    success: false 
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (state.success) {
      setFeedback("");
      setIsDialogOpen(false);
    }
  }, [state.success]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="relative flex h-full w-full flex-col gap-y-4">
      <main className="relative flex min-h-0 w-full grow flex-col">
        <div className="flex h-full w-full flex-row gap-x-2 p-5">
          <div className="dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs relative flex w-full flex-col items-center rounded-2xl border-gray-200 dark:border-[#313131] px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
            <div className="flex h-full w-full flex-col max-w-[--breakpoint-sm]! max-w-[--breakpoint-xl]">
              <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:py-8">
                <h4 className="whitespace-nowrap text-2xl font-medium dark:text-white">
                  Feedback
                </h4>
                <button
                  type="button"
                  className="gap-2 [&_svg]:pointer-events-none [&_svg]:size-4! [&_svg]:shrink-0 dark:border-[#313131] relative inline-flex items-center font-medium select-none justify-center ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap bg-white text-black border border-gray-200 dark:border-[#313131] dark:bg-[#171719] dark:text-white hover:opacity-85 transition-opacity duration-100  h-10 px-4 py-2 rounded-xl text-sm"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <div className="flex flex-row items-center">
                    <IconPlus className="mr-2" />
                    <span>Add Feedback</span>
                  </div>
                </button>
              </div>

              <div className="w-full pb-8 flex flex-col gap-y-8" style={{ opacity: 1 }}>
                <p className="dark:text-[#999999] text-gray-500">
                  Manage feedback from users.
                </p>

                <div className="flex flex-col gap-6">
                  <div className="dark:border-[#313131] overflow-hidden rounded-2xl border border-gray-200">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors dark:bg-[#171719] bg-gray-50">
                            <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                              User
                            </th>
                            <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                              Feedback
                            </th>
                            <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {feedbacks.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                No feedback yet. Be the first to add one!
                              </td>
                            </tr>
                          ) : (
                            feedbacks.map((item) => (
                              <tr key={item.id} className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                <td className="p-4 align-middle">
                                  <div className="flex flex-row items-center gap-2">
                                    <div className="dark:bg-[#171719] dark:border-[#313131] z-2 relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50 text-sm overflow-hidden">
                                      {item.user.image ? (
                                        <img
                                          alt={item.user.name}
                                          loading="eager"
                                          className="z-1 aspect-square rounded-full object-cover opacity-100"
                                          src={item.user.image}
                                        />
                                      ) : (
                                        <span className="text-xs font-medium dark:text-white">
                                          {item.user.name.charAt(0).toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <div className="font-medium text-sm dark:text-white">{item.user.name}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.user.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 align-middle max-w-md">
                                  <p className="text-sm dark:text-gray-300 line-clamp-2">{item.feedback}</p>
                                </td>
                                <td className="p-4 align-middle">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(item.createdAt)}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Feedback Dialog */}
              {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white dark:bg-[#171719] rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-[#313131]">
                    <h3 className="text-lg font-medium mb-4 text-black dark:text-white">Add Feedback</h3>

                    <form action={formAction}>
                      <Textarea
                        name="feedback"
                        placeholder="Enter your feedback here..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full mb-4 px-4 py-2  bg-white border-gray-200 rounded-lg dark:bg-[#171719] dark:border-[#313131] dark:text-white min-h-[120px]"
                        required
                      />
                      
                      {state.error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setFeedback("");
                          }}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#313131] hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors"
                          disabled={isPending}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-[#171719] text-white hover:bg-[#171719] border border-white/10"
                          disabled={isPending || !feedback.trim()}
                        >
                          {isPending ? "Sending..." : "Send Feedback"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

