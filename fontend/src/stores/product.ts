// src/stores/product.js
import { defineStore } from "pinia";
import apiClient from "../api";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    isLoading: false,
    hasMore: true,
    page: 1,
    sort: "random",
    userId: null, // À initialiser avec l'ID de l'utilisateur connecté
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
        const product = this.products.find((p) => p.id === produitId);
        if (product) {
          product.is_favorited_by = !product.is_favorited_by;
          product.favorites_count = product.is_favorited_by
            ? product.favorites_count + 1
            : product.favorites_count - 1;
        }
        const response = await apiClient.post(
          `/produits/${produitId}/favorite`
        );
        console.log(response.data.message);
        
        return response.data.message;
      } catch (error) {
        throw (
          error.response?.data?.message ||
          "Erreur lors de la mise à jour des favoris"
        );
      }
    },

    async viewProduct(produitId) {
      try {
        const response = await apiClient.get(`/produits/${produitId}`);
        const productData = response.data.produit;
        const productIndex = this.products.findIndex((p) => p.id === produitId);
        if (productIndex !== -1) {
          this.products[productIndex] = {
            ...this.products[productIndex],
            ...productData,
          };
        } else {
          this.products.push(productData);
        }
        return productData;
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
