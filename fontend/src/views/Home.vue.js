"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const vue_1 = require("vue");
const vue_toastification_1 = require("vue-toastification");
const ProductCard_vue_1 = __importDefault(require("../components/ProductCard.vue"));
const AppHeader_vue_1 = __importDefault(require("../components/AppHeader.vue"));
const Loader_vue_1 = __importDefault(require("../components/Loader.vue"));
const api_1 = __importDefault(require("../api"));
const product_1 = require("../stores/product");
const productStore = (0, product_1.useProductStore)();
const categories = (0, vue_1.ref)([]);
const toast = (0, vue_toastification_1.useToast)();
const showFilters = (0, vue_1.ref)(false);
const filterForm = (0, vue_1.ref)({
    search: '',
    category: '',
    prix_min: '',
    prix_max: '',
    ville: '',
    collaboratif: '',
});
const villes = (0, vue_1.ref)(['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Garoua']);
const observer = (0, vue_1.ref)(null);
const loadMoreTrigger = (0, vue_1.ref)(null);
const fetchCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api_1.default.get('/categories');
        categories.value = response.data.categories;
    }
    catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        toast.error('Erreur lors du chargement des catégories.');
    }
});
const applyFilters = () => {
    if (filterForm.value.prix_min && filterForm.value.prix_max) {
        if (parseFloat(filterForm.value.prix_min) > parseFloat(filterForm.value.prix_max)) {
            toast.error('Le prix minimum doit être inférieur au prix maximum.');
            return;
        }
    }
    productStore.fetchProducts(filterForm.value, true);
    showFilters.value = false;
};
const resetFilters = () => {
    filterForm.value = { search: '', category: '', prix_min: '', prix_max: '', ville: '', collaboratif: '' };
    productStore.fetchProducts({}, true);
};
const changeSort = (newSort) => {
    productStore.setSort(newSort);
};
const activeFiltersCount = () => {
    return Object.values(filterForm.value).filter(val => val !== '').length;
};
(0, vue_1.onMounted)(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productStore.fetchProducts(); // Appel avec gestion d'erreur
        yield fetchCategories();
    }
    catch (error) {
        console.error('Erreur lors du chargement des produits ou catégories:', error);
        toast.error('Erreur lors du chargement des produits. Veuillez réessayer.');
    }
    observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !productStore.isLoading && productStore.hasMore) {
            productStore.fetchProducts(filterForm.value);
        }
    }, { threshold: 0.1 });
    if (loadMoreTrigger.value) {
        observer.value.observe(loadMoreTrigger.value);
    }
}));
(0, vue_1.onUnmounted)(() => {
    if (observer.value && loadMoreTrigger.value) {
        observer.value.unobserve(loadMoreTrigger.value);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "min-h-screen bg-[var(--espace-blanc)]" }));
/** @type {[typeof AppHeader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AppHeader_vue_1.default, new AppHeader_vue_1.default({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof Loader, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(Loader_vue_1.default, new Loader_vue_1.default({
    isLoading: (__VLS_ctx.productStore.isLoading),
}));
const __VLS_4 = __VLS_3({
    isLoading: (__VLS_ctx.productStore.isLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "container mx-auto px-4 sm:px-6 py-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex overflow-x-auto space-x-2 mb-3 snap-x snap-mandatory" }));
for (const [option] of __VLS_getVForSourceType(([
    { id: 'popular', label: 'Populaire', icon: 'fa-fire' },
    { id: 'favorites', label: 'Favoris', icon: 'fa-heart' },
]))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign(Object.assign(Object.assign({ onClick: (...[$event]) => {
            __VLS_ctx.changeSort(option.id);
        } }, { key: (option.id) }), { class: "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium font-poppins snap-center shrink-0 transition-all duration-200" }), { class: ({
            'bg-[var(--espace-vert)] text-[var(--espace-blanc)]': __VLS_ctx.productStore.sort === option.id,
            'bg-gray-100 text-[var(--espace-vert)] hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]': __VLS_ctx.productStore.sort !== option.id,
        }) }), { 'aria-label': (`Trier par ${option.label}`), 'aria-current': (__VLS_ctx.productStore.sort === option.id ? 'true' : undefined) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas" }, { class: (option.icon) }));
    (option.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex justify-end items-center mb-3" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (...[$event]) => {
        __VLS_ctx.showFilters = !__VLS_ctx.showFilters;
    } }, { class: "relative flex items-center justify-center w-10 h-10 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-full hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition active:scale-95" }), { 'aria-label': (__VLS_ctx.showFilters ? 'Masquer les filtres' : 'Afficher les filtres'), 'aria-expanded': (__VLS_ctx.showFilters) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-filter text-sm" }));
if (__VLS_ctx.activeFiltersCount() > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "absolute -top-1 -right-1 bg-[var(--espace-vert)] text-[var(--espace-blanc)] text-[10px] rounded-full h-5 w-5 flex items-center justify-center" }));
    (__VLS_ctx.activeFiltersCount());
}
const __VLS_6 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    name: "slide-up",
}));
const __VLS_8 = __VLS_7({
    name: "slide-up",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
if (__VLS_ctx.showFilters) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bg-[var(--espace-blanc)] rounded-xl shadow-md p-4 mb-4 fixed bottom-0 left-0 right-0 z-50 sm:static sm:flex sm:items-center sm:gap-3 sm:flex-wrap" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(Object.assign({ onSubmit: (__VLS_ctx.applyFilters) }, { class: "grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex-1 min-w-[120px]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign(Object.assign({ value: (__VLS_ctx.filterForm.search), id: "search", type: "text" }, { class: "w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]" }), { placeholder: "Rechercher...", 'aria-label': "Rechercher un produit" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex-1 min-w-[120px]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(Object.assign({ value: (__VLS_ctx.filterForm.category), id: "category" }, { class: "w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    for (const [cat] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (cat.id),
            value: (cat.id),
        });
        (cat.nom);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex-1 min-w-[100px]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign(Object.assign({ id: "prix_min", type: "number", min: "0" }, { class: "w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]" }), { placeholder: "Prix min", 'aria-label': "Prix minimum" }));
    (__VLS_ctx.filterForm.prix_min);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex-1 min-w-[100px]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign(Object.assign({ id: "prix_max", type: "number", min: "0" }, { class: "w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]" }), { placeholder: "Prix max", 'aria-label': "Prix maximum" }));
    (__VLS_ctx.filterForm.prix_max);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex-1 min-w-[120px]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(Object.assign({ value: (__VLS_ctx.filterForm.ville), id: "ville" }, { class: "w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    for (const [ville] of __VLS_getVForSourceType((__VLS_ctx.villes))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            key: (ville),
            value: (ville),
        });
        (ville);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex-1 min-w-[100px]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(Object.assign({ value: (__VLS_ctx.filterForm.collaboratif), id: "collaboratif" }, { class: "w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "true",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "false",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex gap-2 col-span-2 sm:col-span-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ type: "submit" }, { class: "w-10 h-10 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center active:scale-95" }), { 'aria-label': "Appliquer les filtres" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-check text-sm" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign(Object.assign({ onClick: (__VLS_ctx.resetFilters) }, { type: "button" }), { class: "w-10 h-10 bg-[var(--espace-gris)] text-[var(--espace-blanc)] rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center active:scale-95" }), { 'aria-label': "Réinitialiser les filtres" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-times text-sm" }));
}
var __VLS_9;
const __VLS_10 = {}.TransitionGroup;
/** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.TransitionGroup, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10(Object.assign({ name: "fade", tag: "div" }, { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" })));
const __VLS_12 = __VLS_11(Object.assign({ name: "fade", tag: "div" }, { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" }), ...__VLS_functionalComponentArgsRest(__VLS_11));
__VLS_13.slots.default;
for (const [produit] of __VLS_getVForSourceType((__VLS_ctx.productStore.products))) {
    /** @type {[typeof ProductCard, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(ProductCard_vue_1.default, new ProductCard_vue_1.default({
        key: (produit.id),
        produit: (produit),
    }));
    const __VLS_15 = __VLS_14({
        key: (produit.id),
        produit: (produit),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
}
var __VLS_13;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign(Object.assign({ ref: "loadMoreTrigger" }, { class: "h-10 flex items-center justify-center" }), { 'aria-live': "polite", 'aria-busy': (__VLS_ctx.productStore.isLoading) }));
/** @type {typeof __VLS_ctx.loadMoreTrigger} */ ;
if (!__VLS_ctx.productStore.hasMore) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-[var(--espace-gris)] text-xs font-poppins" }));
}
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['snap-x']} */ ;
/** @type {__VLS_StyleScopedClasses['snap-mandatory']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['snap-center']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-filter']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['-top-1']} */ ;
/** @type {__VLS_StyleScopedClasses['-right-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:static']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[120px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[120px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[100px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[100px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[120px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[100px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:col-span-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-check']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-times']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
var __VLS_dollars;
const __VLS_self = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {
            ProductCard: ProductCard_vue_1.default,
            AppHeader: AppHeader_vue_1.default,
            Loader: Loader_vue_1.default,
            productStore: productStore,
            categories: categories,
            showFilters: showFilters,
            filterForm: filterForm,
            villes: villes,
            loadMoreTrigger: loadMoreTrigger,
            applyFilters: applyFilters,
            resetFilters: resetFilters,
            changeSort: changeSort,
            activeFiltersCount: activeFiltersCount,
        };
    },
});
exports.default = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
