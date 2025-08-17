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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue"); // Added nextTick
const vue_router_1 = require("vue-router");
const Auth_ts_1 = require("../stores/Auth.ts");
const userState_ts_1 = require("../stores/userState.ts");
const index_js_1 = __importDefault(require("../api/index.js"));
const product_ts_1 = require("../stores/product.ts");
// /soldeUser/
const SoldeUser_vue_1 = __importDefault(require("./SoldeUser.vue"));
const authStore = (0, Auth_ts_1.useAuthStore)();
const userStateStore = (0, userState_ts_1.useUserStateStore)();
const router = (0, vue_router_1.useRouter)();
const user = authStore.user;
const route = (0, vue_router_1.useRoute)();
const animateCartBadge = (0, vue_1.ref)(false);
const animateCollaborationBadge = (0, vue_1.ref)(false);
const animateOrdersBadge = (0, vue_1.ref)(false);
const searchQuery = (0, vue_1.ref)('');
const productStore = (0, product_ts_1.useProductStore)();
const showSearch = (0, vue_1.ref)(false); // Toggle for search bar visibility
const searchOverlayRef = (0, vue_1.ref)(null); // Ref for the overlay element
const ignoreNextClick = (0, vue_1.ref)(false); // Flag to ignore the initial click
const navLinks = (0, vue_1.computed)(() => {
    return [
        { to: '/', label: 'Accueil', icon: 'fa-home', badge: 0 },
        ...(authStore.user
            ? [
                { to: '/profil', label: 'Profil', icon: 'fa-user-circle', badge: 0 },
                ...(authStore.user.commercant
                    ? [{ to: '/commercant/produits', label: 'Mes Produits', icon: 'fa-box-open', badge: 0 }]
                    : []),
                { to: '/collaborations', label: 'Collaborations', icon: 'fa-handshake', badge: userStateStore.collaborationsPending },
                { to: '/parrainage', label: 'Mon Parrainage', icon: 'fa-users', badge: 0 },
            ]
            : [
                { to: '/login', label: 'Connexion', icon: 'fa-sign-in-alt', badge: 0 },
                { to: '/register', label: 'Inscription', icon: 'fa-user-plus', badge: 0 },
            ]),
    ];
});
const fetchBadges = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!authStore.user)
        return;
    try {
        const response = yield index_js_1.default.get('/user/badges');
        userStateStore.saveCollaborationsToLocalStorage(response.data.collaborations_pending.map((item) => ({
            produit_id: item.produit_id,
            prix_revente: item.prix_revente,
            status: item.status,
            created_at: item.created_at,
        })));
        userStateStore.saveOrdersToLocalStorage(response.data.orders_pending.map((order) => ({
            id: order.id,
            items: order.items,
            status: order.status,
            created_at: order.created_at,
            total: order.total,
        })));
    }
    catch (error) {
        console.error('Erreur lors du chargement des badges:', error);
    }
});
(0, vue_1.watch)(() => authStore.user, (newUser) => {
    if (newUser) {
        fetchBadges();
        userStateStore.initializeState();
    }
}, { immediate: true });
(0, vue_1.watch)(() => userStateStore.cartCount, () => {
    if (userStateStore.cartCount > 0) {
        animateCartBadge.value = true;
        setTimeout(() => (animateCartBadge.value = false), 300);
    }
});
(0, vue_1.watch)(() => userStateStore.collaborationsPending, () => {
    if (userStateStore.collaborationsPending > 0) {
        animateCollaborationBadge.value = true;
        setTimeout(() => (animateCollaborationBadge.value = false), 300);
    }
});
(0, vue_1.watch)(() => userStateStore.ordersPending, () => {
    if (userStateStore.ordersPending > 0) {
        animateOrdersBadge.value = true;
        setTimeout(() => (animateOrdersBadge.value = false), 300);
    }
});
// Call products API with search query
const performSearch = () => __awaiter(void 0, void 0, void 0, function* () {
    if (searchQuery.value.trim()) {
        try {
            yield productStore.fetchProducts({ search: searchQuery.value.trim() }, true);
            searchQuery.value = ''; // Clear input after search
            showSearch.value = false; // Hide search bar
        }
        catch (error) {
            console.error('Erreur lors de la recherche:', error);
        }
    }
});
// Handle clicks outside the search overlay
const handleClickOutside = (event) => {
    if (ignoreNextClick.value) {
        ignoreNextClick.value = false; // Reset flag after ignoring the first click
        return;
    }
    if (searchOverlayRef.value && !searchOverlayRef.value.contains(event.target)) {
        showSearch.value = false;
    }
};
const toggleSearch = () => __awaiter(void 0, void 0, void 0, function* () {
    showSearch.value = !showSearch.value;
    if (showSearch.value) {
        ignoreNextClick.value = true; // Set flag to ignore the next click
        yield (0, vue_1.nextTick)(); // Wait for DOM to update
    }
});
const goToMessages = () => {
    router.push('/messages');
};
(0, vue_1.onMounted)(() => {
    if (authStore.user) {
        fetchBadges();
        userStateStore.initializeState();
    }
    document.addEventListener('click', handleClickOutside);
});
(0, vue_1.onUnmounted)(() => {
    document.removeEventListener('click', handleClickOutside);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['cart-badge']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "relative bg-green-500" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)(Object.assign({ class: "bg-[var(--espace-vert)] text-[var(--espace-blanc)] fixed top-0 left-0 w-full z-50 shadow-md" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "container mx-auto px-2 sm:px-3 py-2 flex justify-between items-center gap-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center gap-1 sm:gap-3" }));
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    'aria-label': "Retour à l'accueil",
}));
const __VLS_2 = __VLS_1({
    to: "/",
    'aria-label': "Retour à l'accueil",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "rounded-full pb-1 pt-1" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)(Object.assign({ src: "/src/assets/images/logo/logoOrangeweb.webp", alt: "Logo Espace Cameroun" }, { class: "h-10 w-10 object-contain transition-transform duration-300 hover:scale-105 shadow-sm hover:shadow-md" }));
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(Object.assign({ class: "text-lg sm:text-xl font-bold font-poppins text-[var(--espace-blanc)]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)(Object.assign({ class: "hidden lg:flex items-center space-x-4 sm:space-x-6 font-poppins text-sm sm:text-base" }));
for (const [link] of __VLS_getVForSourceType((__VLS_ctx.navLinks))) {
    const __VLS_4 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(Object.assign(Object.assign({ key: (link.to), to: (link.to) }, { class: "hover:text-[var(--espace-or)] flex items-center gap-1 sm:gap-2 transition-colors duration-300" }), { activeClass: "text-[var(--espace-or)]" })));
    const __VLS_6 = __VLS_5(Object.assign(Object.assign({ key: (link.to), to: (link.to) }, { class: "hover:text-[var(--espace-or)] flex items-center gap-1 sm:gap-2 transition-colors duration-300" }), { activeClass: "text-[var(--espace-or)]" }), ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas" }, { class: (link.icon) }));
    (link.label);
    if ((typeof link.badge === 'object' ? link.badge.value : link.badge) > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign(Object.assign({ class: "cart-badge bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center" }, { class: ({
                'animate-scale': (link.to === '/panier' && __VLS_ctx.animateCartBadge) ||
                    (link.to === '/collaborations' && __VLS_ctx.animateCollaborationBadge) ||
                    (link.to === '/commandes' && __VLS_ctx.animateOrdersBadge),
            }) }), { 'aria-label': (link.to === '/panier'
                ? 'Nombre d\'articles dans le panier'
                : link.to === '/collaborations'
                    ? 'Collaborations en attente'
                    : 'Commandes en attente') }));
        (typeof link.badge === 'object' ? link.badge.value : link.badge);
    }
    var __VLS_7;
}
/** @type {[typeof SoldeUser, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(SoldeUser_vue_1.default, new SoldeUser_vue_1.default({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center gap-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (__VLS_ctx.toggleSearch) }, { class: "text-[var(--espace-blanc)] hover:text-[var(--espace-or)] transition-colors duration-300" }), { 'aria-label': "Ouvrir la recherche" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-search text-2xl" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ onClick: (__VLS_ctx.goToMessages) }, { class: " text-[var(--espace-white)] px-1 rounded hover:bg-white transition" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-comment-dots text-2xl" }));
for (const [link] of __VLS_getVForSourceType((__VLS_ctx.navLinks.filter(link => __VLS_ctx.authStore.user ? link.to === '/profil' : ['/login', '/register'].includes(link.to))))) {
    const __VLS_11 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11(Object.assign(Object.assign({ key: (link.to), to: (link.to) }, { class: "relative flex items-center justify-center" }), { 'aria-label': (link.label) })));
    const __VLS_13 = __VLS_12(Object.assign(Object.assign({ key: (link.to), to: (link.to) }, { class: "relative flex items-center justify-center" }), { 'aria-label': (link.label) }), ...__VLS_functionalComponentArgsRest(__VLS_12));
    __VLS_14.slots.default;
    if ((_a = __VLS_ctx.user) === null || _a === void 0 ? void 0 : _a.photo) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(Object.assign({ src: (`http://localhost:8000/storage/${__VLS_ctx.user.photo}`), alt: "Photo de profil" }, { class: "w-10 h-10 rounded-full object-cover border-2 border-[var(--espace-vert)]" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "w-10 h-10 rounded-full  flex items-center justify-center text-[var(--espace-gris)]" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: (`fas ${link.icon}`) }, { class: "text-2xl text-gray-100" }));
    }
    if ((typeof link.badge === 'object' ? link.badge.value : link.badge) > 0 && link.to === '/collaborations') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign(Object.assign({ class: "cart-badge absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center" }, { class: ({ 'animate-scale': link.to === '/collaborations' && __VLS_ctx.animateCollaborationBadge }) }), { 'aria-label': "Collaborations en attente" }));
        (typeof link.badge === 'object' ? link.badge.value : link.badge);
    }
    var __VLS_14;
}
if (__VLS_ctx.showSearch) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ ref: "searchOverlayRef" }, { class: "fixed bg-[var(--espace-vert)] bg-opacity-50 flex items-center top-10 w-full justify-center z-50 p-4" }));
    /** @type {typeof __VLS_ctx.searchOverlayRef} */ ;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "relative w-full max-w-md bg-[var(--espace-blanc)] rounded-lg p-4 shadow-lg" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign(Object.assign({ onKeyup: (__VLS_ctx.performSearch) }, { value: (__VLS_ctx.searchQuery), type: "text", placeholder: "Rechercher un produit..." }), { class: "w-full px-4 py-2 rounded-full text-[var(--espace-vert)] focus:outline-none focus:ring-2 focus:ring-[var(--espace-or)] text-base" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ onClick: (__VLS_ctx.performSearch) }, { class: "absolute right-6 top-1/2 transform -translate-y-1/2 text-[var(--espace-vert)] hover:text-[var(--espace-or)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-search text-lg" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (...[$event]) => {
            if (!(__VLS_ctx.showSearch))
                return;
            __VLS_ctx.showSearch = false;
        } }, { class: "absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--espace-vert)] hover:text-[var(--espace-or)]" }), { 'aria-label': "Fermer la recherche" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-times text-lg" }));
}
const __VLS_15 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    name: "slide-up",
}));
const __VLS_17 = __VLS_16({
    name: "slide-up",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)(Object.assign({ class: "lg:hidden fixed bottom-0 left-0 w-full bg-[var(--espace-vert)] text-[var(--espace-blanc)] shadow-md z-40" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex justify-around items-center py-2" }));
for (const [link] of __VLS_getVForSourceType((__VLS_ctx.navLinks))) {
    const __VLS_19 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19(Object.assign(Object.assign({ key: (link.to), to: (link.to), 'aria-label': (link.label) }, { class: "relative flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300" }), { activeClass: "text-[var(--espace-or)]" })));
    const __VLS_21 = __VLS_20(Object.assign(Object.assign({ key: (link.to), to: (link.to), 'aria-label': (link.label) }, { class: "relative flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300" }), { activeClass: "text-[var(--espace-or)]" }), ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_22.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas text-lg" }, { class: (link.icon) }));
    if ((typeof link.badge === 'object' ? link.badge.value : link.badge) > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign(Object.assign({ class: "cart-badge absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center" }, { class: ({
                'animate-scale': (link.to === '/panier' && __VLS_ctx.animateCartBadge) ||
                    (link.to === '/collaborations' && __VLS_ctx.animateCollaborationBadge) ||
                    (link.to === '/commandes' && __VLS_ctx.animateOrdersBadge),
            }) }), { 'aria-label': (link.to === '/panier'
                ? 'Nombre d\'articles dans le panier'
                : link.to === '/collaborations'
                    ? 'Collaborations en attente'
                    : 'Commandes en attente') }));
        (typeof link.badge === 'object' ? link.badge.value : link.badge);
    }
    var __VLS_22;
}
var __VLS_18;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:space-x-6']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['cart-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-scale']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-search']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-white)]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-comment-dots']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['cart-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-scale']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['top-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-6']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-search']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-4']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-times']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['z-40']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-around']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['cart-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-0']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-scale']} */ ;
var __VLS_dollars;
const __VLS_self = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {
            SoldeUser: SoldeUser_vue_1.default,
            authStore: authStore,
            user: user,
            animateCartBadge: animateCartBadge,
            animateCollaborationBadge: animateCollaborationBadge,
            animateOrdersBadge: animateOrdersBadge,
            searchQuery: searchQuery,
            showSearch: showSearch,
            searchOverlayRef: searchOverlayRef,
            navLinks: navLinks,
            performSearch: performSearch,
            toggleSearch: toggleSearch,
            goToMessages: goToMessages,
        };
    },
});
exports.default = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
