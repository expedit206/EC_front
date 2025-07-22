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
const vue_router_1 = require("vue-router");
const vue_toastification_1 = require("vue-toastification");
const Auth_1 = require("../stores/Auth");
const api_1 = __importDefault(require("../api"));
const Loader_vue_1 = __importDefault(require("../components/Loader.vue"));
const authStore = (0, Auth_1.useAuthStore)();
const router = (0, vue_router_1.useRouter)();
const toast = (0, vue_toastification_1.useToast)();
const isLoading = (0, vue_1.ref)(false);
const produits = (0, vue_1.ref)([]);
const categories = (0, vue_1.ref)([]);
const showAddModal = (0, vue_1.ref)(false);
const showEditModal = (0, vue_1.ref)(false);
const currentProduit = (0, vue_1.ref)(null);
const form = (0, vue_1.ref)({
    nom: '',
    description: '',
    prix: 0,
    stock: 0,
    photo_url: '',
    category_id: '',
    collaboratif: false,
    marge_min: null,
});
const fetchProduits = () => __awaiter(void 0, void 0, void 0, function* () {
    isLoading.value = true;
    try {
        const response = yield api_1.default.get('/commercant/produits');
        produits.value = response.data.produits;
    }
    catch (error) {
        toast.error('Erreur lors du chargement des produits');
    }
    finally {
        isLoading.value = false;
    }
});
const fetchCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    isLoading.value = true;
    try {
        const response = yield api_1.default.get('/categories');
        categories.value = response.data.categories;
    }
    catch (error) {
        toast.error('Erreur lors du chargement des catégories');
    }
    finally {
        isLoading.value = false;
    }
});
const openAddModal = () => {
    form.value = {
        nom: '',
        description: '',
        prix: 0,
        stock: 0,
        photo_url: '',
        category_id: '',
        collaboratif: false,
        marge_min: null,
    };
    showAddModal.value = true;
};
const openEditModal = (produit) => {
    currentProduit.value = produit;
    form.value = {
        nom: produit.nom,
        description: produit.description || '',
        prix: produit.prix,
        stock: produit.stock,
        photo_url: produit.photo_url || '',
        category_id: produit.category_id,
        collaboratif: produit.collaboratif,
        marge_min: produit.marge_min || null,
    };
    showEditModal.value = true;
};
const deleteProduit = (produitId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?'))
        return;
    isLoading.value = true;
    try {
        yield api_1.default.delete(`/commercant/produits/${produitId}`);
        produits.value = produits.value.filter(p => p.id !== produitId);
        toast.success('Produit supprimé');
    }
    catch (error) {
        toast.error('Erreur lors de la suppression');
    }
    finally {
        isLoading.value = false;
    }
});
const submitProduit = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    isLoading.value = true;
    try {
        const data = Object.assign(Object.assign({}, form.value), { prix: Number(form.value.prix), stock: Number(form.value.stock), marge_min: form.value.collaboratif ? Number(form.value.marge_min) : null });
        if (showAddModal.value) {
            yield api_1.default.post('/commercant/produits', data);
            toast.success('Produit ajouté avec succès');
        }
        else {
            yield api_1.default.put(`/commercant/produits/${currentProduit.value.id}`, data);
            toast.success('Produit modifié avec succès');
        }
        yield fetchProduits();
        closeModal();
    }
    catch (error) {
        toast.error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.message) || 'Erreur lors de la sauvegarde du produit');
    }
    finally {
        isLoading.value = false;
    }
});
const closeModal = () => {
    showAddModal.value = false;
    showEditModal.value = false;
    currentProduit.value = null;
};
(0, vue_1.onMounted)(() => {
    var _a;
    if (!((_a = authStore.user) === null || _a === void 0 ? void 0 : _a.commercant)) {
        toast.error('Accès réservé aux commerçants');
        router.push('/');
        return;
    }
    fetchProduits();
    fetchCategories();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['product-card']} */ ;
/** @type {__VLS_StyleScopedClasses['product-card']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['product-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
/** @type {[typeof Loader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Loader_vue_1.default, new Loader_vue_1.default({
    isLoading: (__VLS_ctx.isLoading),
}));
const __VLS_1 = __VLS_0({
    isLoading: (__VLS_ctx.isLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "container mx-auto max-w-4xl" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(Object.assign({ class: "text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6 font-poppins" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-box-open mr-2 text-[var(--espace-or)]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ onClick: (__VLS_ctx.openAddModal) }, { class: "mb-6 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-white transition inline-flex items-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-plus mr-2" }));
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center justify-center py-10" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-spinner animate-spin text-2xl text-[var(--espace-vert)]" }));
}
else if (__VLS_ctx.produits.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" }));
    for (const [produit] of __VLS_getVForSourceType((__VLS_ctx.produits))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ key: (produit.id) }, { class: "bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition relative" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(Object.assign({ src: (produit.photo_url || 'https://via.placeholder.com/150') }, { class: "w-full h-40 object-cover rounded-t-lg mb-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "p-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-lg font-semibold flex justify-between text-[var(--espace-vert)] truncate" }));
        (produit.nom);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.isLoading))
                    return;
                if (!(__VLS_ctx.produits.length))
                    return;
                __VLS_ctx.openEditModal(produit);
            } }, { class: "text-[var(--espace-vert)] hover:text-[var(--espace-or)] p-1 rounded-full hover:bg-gray-100 transition" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-pencil text-sm" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-sm text-[var(--espace-gris)] line-clamp-2" }));
        (produit.description || 'Aucune');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-md font-bold text-[var(--espace-or)] mt-2" }));
        (produit.prix);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-sm text-[var(--espace-gris)]" }));
        (produit.stock);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "text-sm text-[var(--espace-gris)] mt-2" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-eye mr-1" }));
        (produit.views_count || 0);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "ml-4" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-heart mr-1" }));
        (produit.favorites_count || 0);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "absolute bottom-5 right-2 flex gap-2" }));
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-center text-[var(--espace-gris)]" }));
}
const __VLS_3 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    name: "fade",
}));
const __VLS_5 = __VLS_4({
    name: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
if (__VLS_ctx.showAddModal || __VLS_ctx.showEditModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ onClick: (__VLS_ctx.closeModal) }, { class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bg-white rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 shadow-lg" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-lg font-semibold text-[var(--espace-vert)] mb-4" }));
    (__VLS_ctx.showAddModal ? 'Ajouter un produit' : 'Modifier le produit');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(Object.assign({ onSubmit: (__VLS_ctx.submitProduit) }, { class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "text-sm text-[var(--espace-vert)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign({ value: (__VLS_ctx.form.nom), type: "text", required: true }, { class: "input-style" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "text-sm text-[var(--espace-vert)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)(Object.assign({ value: (__VLS_ctx.form.description), rows: "3" }, { class: "input-style" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "text-sm text-[var(--espace-vert)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign({ type: "number", min: "0", required: true }, { class: "input-style" }));
    (__VLS_ctx.form.prix);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "text-sm text-[var(--espace-vert)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign({ type: "number", min: "0", required: true }, { class: "input-style" }));
    (__VLS_ctx.form.stock);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "text-sm text-[var(--espace-vert)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign({ type: "url" }, { class: "input-style" }));
    (__VLS_ctx.form.photo_url);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "text-sm text-[var(--espace-vert)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(Object.assign({ value: (__VLS_ctx.form.category_id), required: true }, { class: "input-style" }));
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center gap-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        id: "collaboratif",
        type: "checkbox",
    });
    (__VLS_ctx.form.collaboratif);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ for: "collaboratif" }, { class: "text-sm text-[var(--espace-vert)]" }));
    if (__VLS_ctx.form.collaboratif) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "text-sm text-[var(--espace-vert)]" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign({ type: "number", min: "0", required: true }, { class: "input-style" }));
        (__VLS_ctx.form.marge_min);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex gap-4 pt-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ type: "submit" }, { class: "flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-white transition" }));
    (__VLS_ctx.showAddModal ? 'Ajouter' : 'Modifier');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (__VLS_ctx.closeModal) }, { type: "button" }), { class: "flex-1 bg-[var(--espace-gris)] text-white font-semibold px-4 py-2 rounded hover:bg-gray-700 transition" }));
}
var __VLS_6;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-box-open']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-plus']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-40']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-t-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-pencil']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['line-clamp-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-md']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-eye']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-heart']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-5']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['input-style']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['input-style']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['input-style']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['input-style']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['input-style']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['input-style']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['input-style']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
var __VLS_dollars;
const __VLS_self = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {
            Loader: Loader_vue_1.default,
            isLoading: isLoading,
            produits: produits,
            categories: categories,
            showAddModal: showAddModal,
            showEditModal: showEditModal,
            form: form,
            openAddModal: openAddModal,
            openEditModal: openEditModal,
            submitProduit: submitProduit,
            closeModal: closeModal,
        };
    },
});
exports.default = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
