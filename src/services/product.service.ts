import productsData from "@/data/products.json";
import { CreateQuestionInput, IProduct, IQuestion } from "@/types";
import {
  ProductsQueryOptionsType,
  QueryParamsType,
  QuestionsQueryOptionsType,
} from "@/types/custom.types";
import { PaginatorInfo } from "@/types/utils";

export const productClient = {
  // ✅ Get all products (with optional filters)
  getProducts: async ({ queryKey }: QueryParamsType) => {
    const [_key, params] = queryKey;
    const { text, category, status, type } = params as ProductsQueryOptionsType;

    // Clone the docs array from JSON
    let filteredProducts: IProduct[] = productsData.docs;

    // Optional filters
    if (text) {
      filteredProducts = filteredProducts.filter((p) =>
        p.name.toLowerCase().includes(text.toLowerCase())
      );
    }
    if (type) {
      filteredProducts = filteredProducts.filter(
        (p) => p.type?.name?.toLowerCase() === type.toLowerCase()
      );
    }
    if (category) {
      filteredProducts = filteredProducts.filter((p) =>
        p.categories?.some(
          (c) => c.name.toLowerCase() === category.toLowerCase()
        )
      );
    }
    if (status) {
      filteredProducts = filteredProducts.filter(
        (p) => {
          if( p.status.publish)
          "publish" === status.toLowerCase()
        else
           "draft" === status.toLowerCase()
        }
      );
    }

    // Return paginator structure (matches your JSON)
    const paginated: PaginatorInfo<IProduct> = {
      docs: filteredProducts,
      totalDocs: productsData.totalDocs ?? filteredProducts.length,
      limit: productsData.limit ?? filteredProducts.length,
      totalPages: productsData.totalPages ?? 1,
      page: productsData.page ?? 1,
      pagingCounter: productsData.pagingCounter ?? 1,
      hasPrevPage: productsData.hasPrevPage ?? false,
      hasNextPage: productsData.hasNextPage ?? false,
      prevPage: productsData.prevPage ?? 0,
      nextPage: productsData.nextPage ?? null,
    };

    return paginated;
  },

  // ✅ Get top-rated products (mocked logic)
  getTopRatedProducts: async () => {
    const topRated = [...productsData.docs]
      .sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
      .slice(0, 10);

    const topRatedPaginator: PaginatorInfo<IProduct> = {
      docs: topRated,
      totalDocs: topRated.length,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: 0,
      nextPage: 0,
    };

    return topRatedPaginator;
  },

  // ✅ Get single product by slug
  getProduct: async (slug: string) => {
    const product = productsData.docs.find((p) => p.slug === slug);
    if (!product) throw new Error("Product not found");
    return product;
  },

  // ✅ Mock create question
  createQuestion: async (data: CreateQuestionInput) => {
    console.log("Mock createQuestion called with:", data);
    return { message: "Question created successfully (mock)" };
  },

  // ✅ Mock get questions
  getQuestions: async ({ queryKey }: QueryParamsType) => {
    console.log("Mock getQuestions called with:", queryKey);
    const mockQuestions: IQuestion[] = [];

    const paginator: PaginatorInfo<IQuestion> = {
      docs: mockQuestions,
      totalDocs: 0,
      limit: 15,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: 0,
      nextPage: 0,
    };

    return paginator;
  },
};
