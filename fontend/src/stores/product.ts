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
            page: this.page,
            sort: this.sort,
            search: params.search || undefined,
            category: params.category || undefined,
            prix_min: params.prix_min || undefined,
            prix_max: params.prix_max || undefined,
            ville: params.ville || undefined,
            collaboratif: params.collaboratif || undefined,
          },
        });
        console.log(response.data);
        this.products = reset
          ? response.data.data
          : [...this.products, ...response.data.data];
        
        this.hasMore = response.data.current_page < response.data.last_page;
        this.page = response.data.current_page + 1;
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
        const response = await apiClient.post(
          `/produits/${produitId}/favorite`
        );
        const product = this.products.find((p) => p.id === produitId);
        if (product) {
          product.is_favorited_by = !product.is_favorited_by;
          product.favorites_count = product.is_favorited_by
            ? product.favorites_count + 1
            : product.favorites_count - 1;
        }
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
  },
});
