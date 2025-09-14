// src/stores/product.js
import { defineStore } from "pinia";
import apiClient from "../api/index";
import { Product } from "../components/types/index";
import { useAuthStore } from "./Auth";
import { useRouter } from "vue-router";

const router = useRouter();

interface FetchProductsParams {
  per_page?: string | number;
  [key: string]: any; // Allow additional params for flexibility
}

export const useProductStore = defineStore("product", {
  state: () => ({
    product: {} as Product, // Single product
    products: [] as Product[],
    isLoading: false,
    hasMore: true,
    page: 1,
    sort: "random",
    userId: null,
    relatedProperties: [],
  }),

  getters: {
    // Getter pour récupérer l'utilisateur actuel depuis Auth
    user: (state) => useAuthStore().user,
  },

  actions: {
    async fetchProducts(params: FetchProductsParams = {}, reset = false) {
      if (this.isLoading || (!reset && !this.hasMore)) return;
      this.isLoading = true;
      if (reset) {
        this.products = [];
        this.page = 1;
        this.hasMore = true;
      }

      try {
        const response = await apiClient.get("/produits", {
          params: {
            ...params,
            page: this.page,
            sort: this.sort,
          },
        });
        
        console.log(response.data)
        //console.log(response.data.data);
        // //console.log(response.data.data);
        // //console.log(response.data.data[0].is_favorited_by);

        if (params.per_page === "all") {
          this.products = reset
            ? response.data
            : [...this.products, ...response.data];
        } else {
          const newProducts = response.data.data;
          this.products = reset
            ? newProducts
            : [...this.products, ...newProducts];
          this.hasMore = response.data.current_page < response.data.last_page;
          this.page = response.data.current_page + 1;
        }
      } catch (error: any) {
          if (error.response?.data?.message == "Unauthenticated.") {
            router.push("login");
          }
    
        throw (
          error.response?.data?.message ||
          "Erreur lors du chargement des produits"
        );
      } finally {
        this.isLoading = false;
      }
    },

    async toggleFavorite(produitId: string) {
      // Vérifier et récupérer l'utilisateur à la volée
      const authStore = useAuthStore();
      if (!authStore.user) {
        await authStore.checkAuth(); // Tente de vérifier l'authentification si pas encore fait
        if (!authStore.user) {
          console.warn(
            "Utilisateur non connecté, redirection ou action nécessaire"
          );
          // window.location.href = "/register"; // Décommentez si vous voulez rediriger
          return;
        }
      }
      // Mettre à jour localement avant l'appel API (optimisation UI)
      const product = this.products.find((p) => p.id === produitId);
      let localUpdate = false;
      if (product) {
        product.is_favorited_by = !product.is_favorited_by;
        product.counts.favorites_count = product.is_favorited_by
          ? product.counts.favorites_count + 1
          : product.counts.favorites_count - 1;
        localUpdate = true;
      }

      if (this.product && this.product.id === produitId) {
        this.product.is_favorited_by = !this.product.is_favorited_by;
        this.product.counts.favorites_count = this.product.is_favorited_by
          ? this.product.counts.favorites_count + 1
          : this.product.counts.favorites_count - 1;
        localUpdate = true;
      }

      try {
        const response = await apiClient.post(
          `/produits/${produitId}/favorite`
        );
        const updatedProduct = response.data.produit;

        // Mettre à jour les données avec les valeurs du backend
        if (localUpdate) {
          const productIndex = this.products.findIndex(
            (p) => p.id === produitId
          );
          if (productIndex !== -1) {
            this.products[productIndex] = {
              ...this.products[productIndex],
              ...updatedProduct,
            };
          }
          if (this.product && this.product.id === produitId) {
            this.product = { ...this.product, ...updatedProduct };
          }
        }

        return response.data.message;
      } catch (error: any) {
          if (error.response?.data?.message == "Unauthenticated.") {
            router.push("login");
          }
    
        console.log(error);
      
        // Revenir à l'état précédent en cas d'erreur
        if (localUpdate) {
          const product = this.products.find((p) => p.id === produitId);
          if (product) {
            product.is_favorited_by = !product.is_favorited_by;
            product.counts.favorites_count = product.is_favorited_by
              ? product.counts.favorites_count - 1
              : product.counts.favorites_count + 1;
          }
          if (this.product && this.product.id === produitId) {
            this.product.is_favorited_by = !this.product.is_favorited_by;
            this.product.counts.favorites_count = this.product.is_favorited_by
              ? this.product.counts.favorites_count - 1
              : this.product.counts.favorites_count + 1;
          }
        }
        // throw (
        //   error ||
        //   "Erreur lors de la mise à jour des favris"
        // );
      }
    },

    async viewProduct(produitId: string | string[]) {
      try {
        const response = await apiClient.get(`/produits/${produitId}`);
        this.product = response.data.produit; // Stocker le produit unique
        const productIndex = this.products.findIndex((p) => p.id === produitId);
        if (productIndex !== -1) {
          this.products[productIndex] = {
            ...this.products[productIndex],
            ...this.product,
          };
        } else {
          this.products.push(this.product);
        }
      } catch (error: any) {
        
          if (error.response?.data?.message == "Unauthenticated.") {
            router.push("login");
          }
    
        throw (
          error.response?.data?.message ||
          "Erreur lors du chargement du produit"
        );
      }
    },

    setSort(sort: any) {
      this.sort = sort;
      this.page = 1;
      this.products = [];
      this.hasMore = true;
      this.fetchProducts({}, true);
    },

    setUserId(userId: any) {
      this.userId = userId;
    },
  },
});
