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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const vue_router_1 = require("vue-router");
const Auth_1 = require("../stores/Auth");
const userState_1 = require("../stores/userState");
const vue_toastification_1 = require("vue-toastification");
const product_1 = require("../stores/product");
const ProductCard_vue_1 = __importDefault(require("../components/ProductCard.vue"));
const Loader_vue_1 = __importDefault(require("../components/Loader.vue"));
const AppHeader_vue_1 = __importDefault(require("../components/AppHeader.vue"));
const api_1 = __importDefault(require("../api"));
const productStore = (0, product_1.useProductStore)();
const route = (0, vue_router_1.useRoute)();
const router = (0, vue_router_1.useRouter)();
const authStore = (0, Auth_1.useAuthStore)();
const userStateStore = (0, userState_1.useUserStateStore)();
const toast = (0, vue_toastification_1.useToast)();
const produit = (0, vue_1.ref)(null);
const relatedProducts = (0, vue_1.ref)([]);
const showCollaborationModal = (0, vue_1.ref)(false);
const prixRevente = (0, vue_1.ref)(null);
const fetchProduit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        productStore.isLoading = true;
        produit.value = yield productStore.viewProduct(route.params.id);
        yield fetchRelatedProducts();
    }
    catch (error) {
        toast.error(error || 'Erreur lors du chargement du produit');
        router.push({ name: 'home' });
    }
    finally {
        productStore.isLoading = false;
    }
});
const fetchRelatedProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield api_1.default.get(`/produits/related/${route.params.id}`, {
            params: { category_id: produit.value.category_id, limit: 4 },
        });
        relatedProducts.value = response.data.produits;
    }
    catch (error) {
        toast.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erreur lors du chargement des produits similaires');
    }
});
const contactCommercant = () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter pour contacter le commerçant');
        router.push({ name: 'login' });
        return;
    }
    const commerçantPhone = produit.value.commercant.telephone;
    const message = encodeURIComponent(`Bonjour ${produit.value.commercant.nom}, je suis intéressé par ${produit.value.nom}. Pouvez-vous me contacter ?`);
    window.open(`https://wa.me/${commerçantPhone}?text=${message}`, '_blank');
};
const openCollaborationModal = () => {
    var _a;
    if (!authStore.user) {
        toast.error('Veuillez vous connecter pour collaborer');
        router.push({ name: 'login' });
        return;
    }
    if (((_a = authStore.user.commercant) === null || _a === void 0 ? void 0 : _a.id) === produit.value.commercant_id) {
        toast.error('Vous ne pouvez pas collaborer sur votre propre produit');
        return;
    }
    if (!produit.value.collaboratif) {
        toast.error('Ce produit n’est pas ouvert à la collaboration');
        return;
    }
    prixRevente.value = produit.value.prix + (produit.value.marge_min || 500);
    showCollaborationModal.value = true;
};
const submitCollaboration = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!prixRevente.value || prixRevente.value < produit.value.prix + (produit.value.marge_min || 0)) {
        toast.error(`Le prix de revente doit être supérieur ou égal à ${produit.value.prix + (produit.value.marge_min || 0)} XAF`);
        return;
    }
    const success = yield userStateStore.addCollaboration({
        produit_id: produit.value.id,
        prix_revente: prixRevente.value,
    });
    if (success) {
        toast.success('Demande de collaboration envoyée', { timeout: 3000 });
        showCollaborationModal.value = false;
        prixRevente.value = null;
    }
});
const closeCollaborationModal = () => {
    showCollaborationModal.value = false;
    prixRevente.value = null;
};
const editProduit = () => {
    router.push({ path: `/commercant/produits/${produit.value.id}/edit` });
};
const viewCommercant = () => {
    router.push(`/commercants/${produit.value.commercant_id}`);
};
// Nouvelle méthode pour booster le produit
const boostProduit = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!authStore.user || ((_a = authStore.user.commercant) === null || _a === void 0 ? void 0 : _a.id) !== produit.value.commercant_id) {
        toast.error('Seul le commerçant propriétaire peut booster ce produit');
        return;
    }
    const cost = 50;
    // console.log(authStore.user.jetons)
    // Coût en Jetons (à ajuster selon votre logique)
    if (authStore.user.jetons < cost) {
        toast.error(`Pas assez de Jetons. Il vous faut ${cost} Jetons pour booster ce produit.`);
        return;
    }
    try {
        const response = yield api_1.default.post(`/produits/${produit.value.id}/boost`);
        // console.log(response.data)
        // Mettre à jour les Jetons localement (optionnel, à synchroniser avec le backend)
        authStore.user.jetons -= cost;
        produit.value.boosted_until = response.data.data.end_date;
        // console.log(response.data.data.end_date);
        toast.success(response.data.message || 'Produit boosté avec succès !');
        // Mettre à jour le statut boosté
    }
    catch (error) {
        toast.error(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Erreur lors du boostage du produit');
    }
});
(0, vue_1.onMounted)(() => {
    fetchProduit();
    userStateStore.initializeState();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "min-h-screen bg-[var(--espace-blanc)] pt-16 pb-20 px-4 sm:px-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "container mx-auto max-w-5xl" }));
if (__VLS_ctx.productStore.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "text-center text-[var(--espace-gris)]" }));
}
else if (__VLS_ctx.produit) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 sm:p-6" }));
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex flex-col lg:flex-row gap-4 sm:gap-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "w-full lg:w-1/2 relative" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(Object.assign({ src: (__VLS_ctx.produit.photo_url || 'https://via.placeholder.com/300'), alt: (`Image de ${__VLS_ctx.produit.nom}`) }, { class: "w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-sm hover:scale-[1.02] transition-transform duration-300" }));
    if (__VLS_ctx.produit.boosted_until && new Date(__VLS_ctx.produit.boosted_until) > new Date()) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "absolute top-3 left-3 bg-[var(--espace-or)] text-[var(--espace-vert)] text-[10px] font-semibold px-2 py-1 rounded-full font-poppins" }, { 'aria-label': "Produit boosté" }));
    }
    if (__VLS_ctx.produit.collaboratif) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "absolute top-3 right-3 bg-[var(--espace-or)] text-[var(--espace-vert)] text-[10px] font-semibold px-2 py-1 rounded-full font-poppins" }, { 'aria-label': "Produit collaboratif" }));
    }
    if (__VLS_ctx.produit.commercant.abonnement_type === 'premium') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "absolute bottom-3 left-3 bg-[var(--espace-bleu)] text-[var(--espace-blanc)] text-[10px] font-semibold px-2 py-1 rounded-full font-poppins" }, { 'aria-label': "Commerçant Premium" }));
    }
    if (__VLS_ctx.produit.commercant.abonnement_type === 'pro') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "absolute bottom-3 left-3 bg-[var(--espace-bleu)] text-[var(--espace-blanc)] text-[10px] font-semibold px-2 py-1 rounded-full font-poppins" }, { 'aria-label': "Commerçant Pro" }));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "w-full lg:w-1/2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(Object.assign({ class: "text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--espace-vert)] mb-3 font-poppins" }));
    (__VLS_ctx.produit.nom);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-sm text-[var(--espace-gris)] mb-3" }));
    (__VLS_ctx.produit.description || 'Aucune');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-lg sm:text-xl font-semibold text-[var(--espace-or)] mb-3" }));
    (__VLS_ctx.produit.prix);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "grid grid-cols-2 gap-3 sm:gap-4 mb-4 text-xs text-[var(--espace-gris)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (((_a = __VLS_ctx.produit.category) === null || _a === void 0 ? void 0 : _a.nom) || 'Non spécifiée');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.produit.quantite);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.produit.ville || 'Non spécifiée');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (new Date(__VLS_ctx.produit.created_at).toLocaleDateString('fr-FR'));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center gap-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center gap-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-eye text-[10px]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.produit.views_count);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center gap-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-heart text-[10px]" }, { class: ({ 'text-[var(--espace-or)]': __VLS_ctx.produit.is_favorited_by }) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.produit.favorites_count);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (...[$event]) => {
            if (!!(__VLS_ctx.productStore.isLoading))
                return;
            if (!(__VLS_ctx.produit))
                return;
            __VLS_ctx.productStore.toggleFavorite(__VLS_ctx.produit.id);
        } }, { class: "w-full bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold py-2 rounded-lg hover:from-[var(--espace-vert)] hover:to-[var(--espace-or)] transition-all duration-200 active:scale-95 text-sm mb-3" }), { 'aria-label': (__VLS_ctx.produit.is_favorited_by ? 'Retirer des favoris' : 'Ajouter aux favoris') }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-heart mr-2 text-sm" }, { class: ({ 'text-[var(--espace-or)]': __VLS_ctx.produit.is_favorited_by }) }));
    (__VLS_ctx.produit.is_favorited_by ? 'Retirer des favoris' : 'Ajouter aux favoris');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "border-t pt-3 mt-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-base font-semibold text-[var(--espace-vert)] mb-2 font-poppins" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-xs text-[var(--espace-gris)] mb-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.produit.commercant.nom);
    if (__VLS_ctx.produit.commercant.verified) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "ml-1 text-[var(--espace-or)]" }, { 'aria-label': "Commerçant vérifié", title: "Commerçant vérifié" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-check-circle text-[10px]" }));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-xs text-[var(--espace-gris)] mb-1" }));
    (__VLS_ctx.produit.commercant.bio || 'Aucune description disponible');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-xs text-[var(--espace-gris)] mb-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.produit.commercant.ville || 'Non spécifiée');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-xs text-[var(--espace-gris)] mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (__VLS_ctx.produit.commercant.rating || 'Non évalué');
    const __VLS_10 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10(Object.assign(Object.assign({ to: (`/commercants/${__VLS_ctx.produit.commercant_id}`) }, { class: "text-[var(--espace-vert)] hover:text-[var(--espace-or)] hover:underline text-xs font-poppins" }), { 'aria-label': "Voir le profil du commerçant" })));
    const __VLS_12 = __VLS_11(Object.assign(Object.assign({ to: (`/commercants/${__VLS_ctx.produit.commercant_id}`) }, { class: "text-[var(--espace-vert)] hover:text-[var(--espace-or)] hover:underline text-xs font-poppins" }), { 'aria-label': "Voir le profil du commerçant" }), ...__VLS_functionalComponentArgsRest(__VLS_11));
    __VLS_13.slots.default;
    var __VLS_13;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (__VLS_ctx.viewCommercant) }, { class: "text-[var(--espace-vert)] hover:text-[var(--espace-or)] underline transition active:scale-95 text-xs" }), { 'aria-label': "Voir le commerçant" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex flex-col sm:flex-row gap-3 mt-4" }));
    if (((_c = (_b = __VLS_ctx.authStore.user) === null || _b === void 0 ? void 0 : _b.commercant) === null || _c === void 0 ? void 0 : _c.id) !== __VLS_ctx.produit.commercant_id) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (__VLS_ctx.contactCommercant) }, { class: "flex-1 bg-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] text-white hover:text-[var(--espace-blanc)] transition-all duration-200 active:scale-95 text-sm" }), { 'aria-label': "Contacter le commerçant" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-phone mr-2 text-sm" }));
    }
    if (__VLS_ctx.produit.collaboratif && ((_e = (_d = __VLS_ctx.authStore.user) === null || _d === void 0 ? void 0 : _d.commercant) === null || _e === void 0 ? void 0 : _e.id) !== __VLS_ctx.produit.commercant_id) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (__VLS_ctx.openCollaborationModal) }, { class: "flex-1 bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition-all duration-200 active:scale-95 text-sm" }), { 'aria-label': "Collaborer sur ce produit" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-handshake mr-2 text-sm" }));
    }
    if (((_g = (_f = __VLS_ctx.authStore.user) === null || _f === void 0 ? void 0 : _f.commercant) === null || _g === void 0 ? void 0 : _g.id) === __VLS_ctx.produit.commercant_id) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (__VLS_ctx.editProduit) }, { class: "flex-1 bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition-all duration-200 active:scale-95 text-sm" }), { 'aria-label': "Modifier le produit" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-edit mr-2 text-sm" }));
    }
    if (((_j = (_h = __VLS_ctx.authStore.user) === null || _h === void 0 ? void 0 : _h.commercant) === null || _j === void 0 ? void 0 : _j.id) === __VLS_ctx.produit.commercant_id) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (__VLS_ctx.boostProduit) }, { class: "flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-all duration-200 active:scale-95 text-sm" }), { disabled: (__VLS_ctx.produit.boosted_until && new Date(__VLS_ctx.produit.boosted_until) > new Date()), 'aria-label': (__VLS_ctx.produit.boosted_until && new Date(__VLS_ctx.produit.boosted_until) > new Date() ? 'Boost déjà actif' : 'Booster ce produit') }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-rocket mr-2 text-sm" }));
        (__VLS_ctx.produit.boosted_until && new Date(__VLS_ctx.produit.boosted_until) > new Date() ? 'Boost' : 'Booster (50 Jetons)');
    }
    var __VLS_9;
    if (__VLS_ctx.relatedProducts.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "mt-6" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-lg sm:text-xl font-bold text-[var(--espace-vert)] mb-3 font-poppins" }));
        const __VLS_14 = {}.TransitionGroup;
        /** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.TransitionGroup, ]} */ ;
        // @ts-ignore
        const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14(Object.assign({ name: "fade", tag: "div" }, { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" })));
        const __VLS_16 = __VLS_15(Object.assign({ name: "fade", tag: "div" }, { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" }), ...__VLS_functionalComponentArgsRest(__VLS_15));
        __VLS_17.slots.default;
        for (const [related] of __VLS_getVForSourceType((__VLS_ctx.relatedProducts))) {
            /** @type {[typeof ProductCard, ]} */ ;
            // @ts-ignore
            const __VLS_18 = __VLS_asFunctionalComponent(ProductCard_vue_1.default, new ProductCard_vue_1.default(Object.assign({ 'onToggleFavorite': {} }, { key: (related.id), produit: (related) })));
            const __VLS_19 = __VLS_18(Object.assign({ 'onToggleFavorite': {} }, { key: (related.id), produit: (related) }), ...__VLS_functionalComponentArgsRest(__VLS_18));
            let __VLS_21;
            let __VLS_22;
            let __VLS_23;
            const __VLS_24 = {
                onToggleFavorite: (...[$event]) => {
                    if (!!(__VLS_ctx.productStore.isLoading))
                        return;
                    if (!(__VLS_ctx.produit))
                        return;
                    if (!(__VLS_ctx.relatedProducts.length))
                        return;
                    __VLS_ctx.productStore.toggleFavorite(related.id);
                }
            };
            var __VLS_20;
        }
        var __VLS_17;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "text-center text-[var(--espace-gris)] text-sm font-poppins" }));
}
const __VLS_25 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    name: "fade",
}));
const __VLS_27 = __VLS_26({
    name: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
if (__VLS_ctx.showCollaborationModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign(Object.assign({ onClick: (__VLS_ctx.closeCollaborationModal) }, { class: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }), { role: "dialog", 'aria-modal': "true", 'aria-label': "Proposer un prix de revente" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bg-[var(--espace-blanc)] rounded-lg p-4 sm:p-6 w-full max-w-md mx-4 shadow-lg" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-base sm:text-lg font-semibold text-[var(--espace-vert)] mb-3 font-poppins" }));
    (__VLS_ctx.produit.nom);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-xs text-[var(--espace-gris)] mb-3" }));
    (__VLS_ctx.produit.prix + (__VLS_ctx.produit.marge_min || 0));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(Object.assign({ onSubmit: (__VLS_ctx.submitCollaboration) }, { class: "space-y-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ for: "prix_revente" }, { class: "text-xs text-[var(--espace-vert)] font-medium" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign(Object.assign({ id: "prix_revente", type: "number", min: "0" }, { class: "w-full h-10 p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition" }), { 'aria-label': (`Prix de revente pour ${__VLS_ctx.produit.nom}`), required: true }));
    (__VLS_ctx.prixRevente);
    if (__VLS_ctx.prixRevente) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-xs text-[var(--espace-gris)] mt-1" }));
        (__VLS_ctx.prixRevente - __VLS_ctx.produit.prix);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex gap-3" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ type: "submit" }, { class: "flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-all duration-200 active:scale-95 text-xs" }), { 'aria-label': "Envoyer la demande de collaboration" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign(Object.assign({ onClick: (__VLS_ctx.closeCollaborationModal) }, { type: "button" }), { class: "flex-1 bg-[var(--espace-gris)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 active:scale-95 text-xs" }), { 'aria-label': "Annuler" }));
}
var __VLS_28;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-5xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:w-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-64']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:h-80']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:h-96']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-[1.02]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-3']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-3']} */ ;
/** @type {__VLS_StyleScopedClasses['right-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-3']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-bleu)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-3']} */ ;
/** @type {__VLS_StyleScopedClasses['left-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-bleu)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:w-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-eye']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-heart']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:from-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:to-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-heart']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-check-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['underline']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-phone']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-handshake']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-rocket']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['active:scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
var __VLS_dollars;
const __VLS_self = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {
            ProductCard: ProductCard_vue_1.default,
            Loader: Loader_vue_1.default,
            AppHeader: AppHeader_vue_1.default,
            productStore: productStore,
            authStore: authStore,
            produit: produit,
            relatedProducts: relatedProducts,
            showCollaborationModal: showCollaborationModal,
            prixRevente: prixRevente,
            contactCommercant: contactCommercant,
            openCollaborationModal: openCollaborationModal,
            submitCollaboration: submitCollaboration,
            closeCollaborationModal: closeCollaborationModal,
            editProduit: editProduit,
            viewCommercant: viewCommercant,
            boostProduit: boostProduit,
        };
    },
});
exports.default = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
