import Pagination from "@/components/ui/pagination";
import RatingsBadge from "@/components/ui/rating-badge";
import RatingProgressBar from "@/components/ui/rating-progress-bar";
import { useQuestionsQuery } from "@/hooks/api/question/question";
import { useReviews } from "@/hooks/api/review/review";
import { cn } from "@/lib/utils";
import QuestionCard from "@/modules/questions/questionCard";
import ReviewCard from "@/modules/review/review-card";
import { useGlobalModalStateStore } from "@/store/modal";
import { IPaginatorInfo, IProduct } from "@/types";
import { authorizationAtom } from "@/utils/authorization-atom";
import { Tab } from "@headlessui/react";
import { useAtom } from "jotai";
import { useState } from "react";

interface Props {
  product: IProduct;
}

export default function ProductDetailsTab({ product }: Props) {
  let [tabHeading] = useState({
    Product_Details: "",
    Review_Rating: "",
    QA: "",
  });

  const [page, setPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);

  const { data, isLoading } = useQuestionsQuery({
    page,
    product: product?._id,
    limit: 10,
  });

  const { data: review, isLoading: reviewLoading } = useReviews({
    page: reviewPage,
    product: product?._id,
    limit: 10,
  });

  const questions = data?.docs || [];

  const paginateInfo: IPaginatorInfo = {
    hasNextPage: data?.hasNextPage ?? false,
    hasPrevPage: data?.hasPrevPage ?? false,
    limit: data?.limit ?? 10,
    nextPage: data?.nextPage ?? 0,
    page: data?.page ?? 1,
    pagingCounter: data?.pagingCounter ?? 1,
    prevPage: data?.prevPage ?? 0,
    totalDocs: data?.totalDocs ?? 0,
    totalPages: data?.totalPages ?? 1,
  };

  const paginate: IPaginatorInfo = {
    hasNextPage: review?.hasNextPage ?? false,
    hasPrevPage: review?.hasPrevPage ?? false,
    limit: review?.limit ?? 10,
    nextPage: review?.nextPage ?? 0,
    page: review?.page ?? 1,
    pagingCounter: review?.pagingCounter ?? 1,
    prevPage: review?.prevPage ?? 0,
    totalDocs: review?.totalDocs ?? 0,
    totalPages: review?.totalPages ?? 1,
  };

  function onPagination(current: number) {
    setPage(current);
  }

  function onReviewPagination(current: number) {
    setReviewPage(current);
  }

  const [isAuthorized] = useAtom(authorizationAtom);
  const globalModal = useGlobalModalStateStore((state) => state);

  return (
    <div className="w-full py-11 lg:py-14 xl:py-16">
      <Tab.Group>
        <Tab.List className="block border-b border-border-base text-xs sm:text-sm md:text-base">
          {Object.keys(tabHeading).map((item) => (
            <Tab
              key={item}
              className={({ selected }) =>
                cn(
                  "relative inline-block transition-all text-15px lg:text-17px leading-5 text-gray-700 focus:outline-none pb-3 lg:pb-5 hover:text-primary ml-8",
                  selected
                    ? "font-semibold after:absolute after:w-full after:h-0.5 after:bottom-0 after:translate-y-[1px] after:right-0 after:bg-primary"
                    : ""
                )
              }
            >
              {item.split("_").join(" ")}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-6 lg:mt-9">
          {/* Product Details Tab */}
          <Tab.Panel className="lg:flex">
            <div className="text-sm sm:text-15px text-brand-muted leading-[2em] space-y-4 lg:space-y-5 xl:space-y-7">
              <p>
                Go sporty this summer with this vintage navy and white striped
                v-neck t-shirt from the Abercrombie & Fitch. Perfect for pairing
                with denim and white kicks for a stylish sporty vibe.
              </p>
              <p>
                Typography is the work of typographers, designers, and anyone
                arranging words and letters for publication or display.
              </p>
              <p>
                Hit your next workout with a freedom-instilling regular fit and
                lightweight material to keep you fresh.
              </p>
            </div>
          </Tab.Panel>

          {/* Review & Rating Tab */}
          <Tab.Panel className="min-w-[270px] w-full mx-auto">
            <div className="flex flex-col justify-center space-y-6 md:space-y-0 md:flex-row md:items-center px-5">
              <div className="md:max-w-md w-full px-3">
                <RatingsBadge
                  rating={product?.ratings ?? 0}
                  className="mb-4"
                  totalRating={product?.rating_count?.length ?? 0}
                  variant="large"
                />
                <div className="w-full space-y-3 py-0.5 pt-4 sm:w-auto sm:pt-0 sm:pr-8 md:border-r">
                  {[5, 4, 3, 2, 1].map((rate) => (
                    <RatingProgressBar
                      key={rate}
                      ratingProgressItem={product?.rating_count?.find(
                        (rating: any) => Number(rating?.rating) === rate
                      )}
                      ratingId={rate}
                      totalReviews={Number(product?.totalReviews ?? 0)}
                      colorClassName={
                        rate === 5
                          ? "bg-green-500"
                          : rate === 4
                          ? "bg-teal-500"
                          : rate === 3
                          ? "bg-teal-400"
                          : rate === 2
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }
                    />
                  ))}

                  <div className="flex mt-4 flex-col justify-center space-y-6">
                    <div className="gap-2">
                      <h1 className="text-xl text-gray-900 dark:text-white font-medium">
                        Review this product
                      </h1>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Let other customers know what you think
                      </p>
                    </div>

                    <button
                      className="py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-white"
                      disabled={!isAuthorized}
                      onClick={() =>
                        globalModal.setReviewModalState(true, product)
                      }
                    >
                      Write a Review
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full sm:px-3">
                {review?.docs?.length ? (
                  <div className={cn("border-b border-border border-opacity-70")}>
                    <div className="space-y-6 w-full mx-auto">
                      {review?.docs?.map((review: any) => (
                        <ReviewCard
                          key={`review-no-${review._id}`}
                          review={review}
                        />
                      ))}
                      {paginate && (
                        <div className="flex items-center justify-between border-t border-border border-opacity-70 py-4">
                          {!!paginate?.totalDocs && (
                            <div className="text-xs text-body text-opacity-70">
                              Page {paginate?.page} of{" "}
                              {paginate?.totalPages ?? 1}
                            </div>
                          )}
                          {!!paginate?.totalDocs && (
                            <div className="mb-2 flex items-center">
                              <Pagination
                                total={paginate?.totalDocs}
                                current={paginate?.pagingCounter}
                                pageSize={paginate?.limit ?? 10}
                                onChange={onReviewPagination}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-b border-border border-opacity-70 px-5 py-16">
                    <h3 className="text-lg font-semibold text-gray-400 dark:text-white">
                      No Review Found
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>

          {/* Q&A Tab */}
          <Tab.Panel>
            <div className="flex flex-col">
              <div className="flex flex-col justify-center sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-sm sm:text-lg text-gray-800 dark:text-white font-medium">
                  Have Doubts Regarding This Product?
                </h1>
                <button
                  className="py-2 px-4 mt-3 sm:mt-0 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-white text-sm sm:text-base"
                  disabled={!isAuthorized}
                  onClick={() =>
                    globalModal.setPostQuestionState(true, product)
                  }
                >
                  Post Your Question
                </button>
              </div>

              <div>
                {data?.docs?.length ? (
                  <div className={cn("border-b border-border border-opacity-70")}>
                    <div>
                      {questions.map((question: any) => (
                        <QuestionCard
                          key={`question-no-${question._id}`}
                          question={question}
                        />
                      ))}
                      {paginateInfo && (
                        <div className="flex items-center justify-between border-t border-border border-opacity-70 py-4">
                          {!!paginateInfo?.totalDocs && (
                            <div className="text-xs text-body text-opacity-70">
                              Page {paginateInfo?.page} of{" "}
                              {paginateInfo?.totalPages ?? 1}
                            </div>
                          )}
                          {!!paginateInfo?.totalDocs && (
                            <div className="mb-2 flex items-center">
                              <Pagination
                                total={paginateInfo?.totalDocs}
                                current={paginateInfo?.pagingCounter}
                                pageSize={paginateInfo?.limit ?? 10}
                                onChange={onPagination}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-b border-border border-opacity-70 px-5 py-16">
                    <h3 className="text-lg font-semibold text-gray-400 dark:text-white">
                      No Question Found
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
