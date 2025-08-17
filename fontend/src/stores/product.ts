// src/stores/product.js
import { defineStore } from "pinia";
import apiClient from "../api/index";
import { Product } from "@/types/product";
export const useProductStore = defineStore("product", {
  state: () => ({
    product: {} as Product, // Single product
    products: [] as Product[],
    isLoading: false,
    hasMore: true,
    page: 1,
    sort: "random",
    userId: null,
    relatedProducts: [],
  }),

  actions: {
    async fetchProducts(params = {}, reset = false) {
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
        console.log(response.data.data);
        console.log(response.data);

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
      } catch (error) {
        throw (
          error.response?.data?.message ||
          "Erreur lors du chargement des produits"
        );
      } finally {
        this.isLoading = false;
      }
    },
    async toggleFavorite(produitId) {
      try {
        // Mettre à jour dans la liste des produits
        const product = this.products.find((p) => p.id === produitId);
        if (product) {
          product.is_favorited_by = !product.is_favorited_by;
          product.favorites_count = product.is_favorited_by
            ? product.favorites_count + 1
            : product.favorites_count - 1;
        }

        // Mettre à jour le produit unique affiché
        if (this.product && this.product.id === produitId) {
          this.product.is_favorited_by = !this.product.is_favorited_by;
          this.product.favorites_count = this.product.is_favorited_by
            ? this.product.favorites_count + 1
            : this.product.favorites_count - 1;
        }

        const response = await apiClient.post(
          `/produits/${produitId}/favorite`
        );
        return response.data.message;
      } catch (error) {
        throw (
          error.response?.data?.message ||
          "Erreur lors de la mise à jour des favoris"
        );
      }
    },

    // async viewProduct(produitId) {
    //   try {
    //      const response = await apiClient.get(`/produits/${produitId}`);
    //      this.product = response.data.produit;
    //     const productIndex = this.products.findIndex((p) => p.id === produitId);
    //     if (productIndex !== -1) {
    //       this.products[productIndex] = {
    //         ...this.products[productIndex],
    //         ...this.product,
    //       };
    //     } else {
    //       this.products.push(this.product);
    //     }
    //   } catch (error) {
    //     throw (
    //       error.response?.data?.message ||
    //       "Erreur lors du chargement du produit"
    //     );
    //   }
    // },

    async viewProduct(produitId) {
      try {
        console.log("jjj");
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
      } catch (error) {
        throw (
          error.response?.data?.message ||
          "Erreur lors du chargement du produit"
        );
      }
    },

    setSort(sort) {
      this.sort = sort;
      this.page = 1;
      this.products = [];
      this.hasMore = true;
      this.fetchProducts({}, true);
    },

    setUserId(userId) {
      this.userId = userId;
    },
  },
});
