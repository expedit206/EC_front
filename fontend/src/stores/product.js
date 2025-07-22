"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProductStore = void 0;
// src/stores/product.js
const pinia_1 = require("pinia");
const api_1 = __importDefault(require("../api"));
exports.useProductStore = (0, pinia_1.defineStore)('product', {
    state: () => ({
        products: [],
        isLoading: false,
        hasMore: true,
        page: 1,
        sort: 'random',
    }),
    actions: {
        fetchProducts() {
            return __awaiter(this, arguments, void 0, function* (params = {}, reset = false) {
                var _a, _b;
                if (this.isLoading || (!reset && !this.hasMore))
                    return;
                this.isLoading = true;
                if (reset) {
                    this.products = [];
                    this.page = 1;
                    this.hasMore = true;
                }
                console.log(params);
                try {
                    const response = yield api_1.default.get('/produits', {
                        params: Object.assign(Object.assign({}, params), { page: this.page, sort: this.sort }),
                    });
                    console.log(response.data.data);
                    if (params.per_page === 'all') {
                        this.products = reset ? response.data : [...this.products, ...response.data];
                    }
                    else {
                        this.products = reset ? response.data.data : [...this.products, ...response.data.data];
                        this.hasMore = response.data.current_page < response.data.last_page;
                        this.page = response.data.current_page + 1;
                    }
                    ;
                }
                catch (error) {
                    throw ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erreur lors du chargement des produits';
                }
                finally {
                    this.isLoading = false;
                }
            });
        },
        toggleFavorite(produitId) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    const product = this.products.find((p) => p.id === produitId);
                    if (product) {
                        product.is_favorited_by = !product.is_favorited_by;
                        product.favorites_count = product.is_favorited_by
                            ? product.favorites_count + 1
                            : product.favorites_count - 1;
                    }
                    const response = yield api_1.default.post(`/produits/${produitId}/favorite`);
                    console.log(response.data);
                    return response.data.message;
                }
                catch (error) {
                    throw ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erreur lors de la mise à jour des favoris';
                }
            });
        },
        viewProduct(produitId) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    const response = yield api_1.default.get(`/produits/${produitId}`);
                    const productData = response.data.produit;
                    const productIndex = this.products.findIndex((p) => p.id === produitId);
                    if (productIndex !== -1) {
                        this.products[productIndex] = Object.assign(Object.assign({}, this.products[productIndex]), productData);
                    }
                    else {
                        this.products.push(productData);
                    }
                    return productData;
                }
                catch (error) {
                    throw ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erreur lors du chargement du produit';
                }
            });
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
