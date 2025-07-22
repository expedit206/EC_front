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
const product_1 = require("../stores/product");
const vue_toastification_1 = require("vue-toastification");
const Loader_vue_1 = __importDefault(require("./Loader.vue"));
const store = (0, product_1.useProductStore)();
const toast = (0, vue_toastification_1.useToast)();
const observer = (0, vue_1.ref)(null);
(0, vue_1.onMounted)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield store.fetchProducts();
    setupIntersectionObserver();
}));
(0, vue_1.onUnmounted)(() => {
    if (observer.value)
        observer.value.disconnect();
});
const setupIntersectionObserver = () => {
    const target = document.querySelector('#load-more');
    if (!target)
        return;
    observer.value = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && store.hasMore && !store.isLoading) {
            store.fetchProducts(true);
        }
    }, { threshold: 0.1 });
    observer.value.observe(target);
};
const toggleFavorite = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield store.toggleFavorite(productId);
        toast.success(message, { timeout: 3000 });
    }
    catch (error) {
        toast.error(error, { timeout: 3000 });
    }
});
const changeSort = (sort) => {
    store.setSort(sort);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "min-h-screen bg-[var(--espace-blanc)] p-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex overflow-x-auto space-x-2 mb-4 snap-x snap-mandatory lg:justify-center" }));
for (const [option] of __VLS_getVForSourceType(([
    { id: 'random', label: 'Aléatoire', icon: 'fa-random' },
    { id: 'popular', label: 'Populaire', icon: 'fa-fire' },
    { id: 'favorites', label: 'Favoris', icon: 'fa-heart' },
]))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign(Object.assign(Object.assign({ onClick: (...[$event]) => {
            __VLS_ctx.changeSort(option.id);
        } }, { key: (option.id) }), { class: "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium font-poppins snap-center shrink-0 transition-all duration-200" }), { class: ({
            'bg-[var(--espace-vert)] text-[var(--espace-blanc)]': __VLS_ctx.store.sort === option.id,
            'bg-gray-100 text-[var(--espace-vert)] hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]': __VLS_ctx.store.sort !== option.id,
        }) }), { 'aria-label': (`Trier par ${option.label}`) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas" }, { class: (option.icon) }));
    (option.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }));
const __VLS_0 = {}.TransitionGroup;
/** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.TransitionGroup, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "fade",
}));
const __VLS_2 = __VLS_1({
    name: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
for (const [product] of __VLS_getVForSourceType((__VLS_ctx.store.products))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ key: (product.id) }, { class: "bg-[var(--espace-blanc)] border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-all duration-200" }));
    const __VLS_4 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(Object.assign({ to: (`/products/${product.id}`) }, { class: "block" })));
    const __VLS_6 = __VLS_5(Object.assign({ to: (`/products/${product.id}`) }, { class: "block" }), ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(Object.assign({ src: (product.image_url || 'https://via.placeholder.com/150'), alt: "Image du produit" }, { class: "w-full h-40 object-cover rounded-md mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(Object.assign({ class: "text-sm font-semibold text-[var(--espace-vert)] font-poppins" }));
    (product.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-xs text-[var(--espace-gris)] truncate" }));
    (product.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-sm font-medium text-[var(--espace-or)]" }));
    (product.price);
    var __VLS_7;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center justify-between mt-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center gap-2 text-xs text-[var(--espace-gris)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-eye" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (product.view_count);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center gap-2 text-xs text-[var(--espace-gris)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-heart" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (product.favorite_count);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (...[$event]) => {
            __VLS_ctx.toggleFavorite(product.id);
        } }, { class: "text-[var(--espace-vert)] hover:text-[var(--espace-or)] transition" }), { 'aria-label': (product.is_favorited_by ? 'Retirer des favoris' : 'Ajouter aux favoris') }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-heart" }, { class: ({ 'text-[var(--espace-or)]': product.is_favorited_by }) }));
}
var __VLS_3;
if (__VLS_ctx.store.hasMore) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ id: "load-more" }, { class: "h-10 flex justify-center items-center" }));
    /** @type {[typeof Loader, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(Loader_vue_1.default, new Loader_vue_1.default({
        isLoading: (__VLS_ctx.store.isLoading),
    }));
    const __VLS_9 = __VLS_8({
        isLoading: (__VLS_ctx.store.isLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
}
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['snap-x']} */ ;
/** @type {__VLS_StyleScopedClasses['snap-mandatory']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:justify-center']} */ ;
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
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-40']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-eye']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-heart']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-heart']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {
            Loader: Loader_vue_1.default,
            store: store,
            toggleFavorite: toggleFavorite,
            changeSort: changeSort,
        };
    },
});
exports.default = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
