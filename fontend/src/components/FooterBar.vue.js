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
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const vue_router_1 = require("vue-router");
const Auth_ts_1 = require("../stores/Auth.ts");
const userState_ts_1 = require("../stores/userState.ts");
const authStore = (0, Auth_ts_1.useAuthStore)();
const userStateStore = (0, userState_ts_1.useUserStateStore)();
const router = (0, vue_router_1.useRouter)();
const animateCollaborationBadge = (0, vue_1.ref)(false); // Badge pour collaborations
const animateMessagesBadge = (0, vue_1.ref)(false); // Badge pour messages (facultatif)
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
                // Ajout optionnel pour messages
                { to: '/messages', label: 'Messages', icon: 'fa-comment-dots', badge: userStateStore.unreadMessages },
            ]
            : [
                { to: '/login', label: 'Connexion', icon: 'fa-sign-in-alt', badge: 0 },
                { to: '/register', label: 'Inscription', icon: 'fa-user-plus', badge: 0 },
            ]),
    ];
});
// Watchers pour animer les badges
(0, vue_1.watch)(() => userStateStore.collaborationsPending, (newValue) => {
    if (newValue > 0) {
        animateCollaborationBadge.value = true;
        setTimeout(() => (animateCollaborationBadge.value = false), 300);
    }
});
(0, vue_1.watch)(() => userStateStore.unreadMessages, (newValue) => {
    if (newValue > 0) {
        animateMessagesBadge.value = true;
        setTimeout(() => (animateMessagesBadge.value = false), 300);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['cart-badge']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "relative" }));
const __VLS_0 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "slide-up",
}));
const __VLS_2 = __VLS_1({
    name: "slide-up",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)(Object.assign({ class: "lg:hidden fixed bottom-0 left-0 w-full bg-[var(--espace-vert)] text-[var(--espace-blanc)] shadow-md z-40" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex justify-around items-center py-2" }));
for (const [link] of __VLS_getVForSourceType((__VLS_ctx.navLinks))) {
    const __VLS_4 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(Object.assign(Object.assign({ key: (link.to), to: (link.to), 'aria-label': (link.label) }, { class: "relative flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300" }), { activeClass: "text-[var(--espace-or)]" })));
    const __VLS_6 = __VLS_5(Object.assign(Object.assign({ key: (link.to), to: (link.to), 'aria-label': (link.label) }, { class: "relative flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300" }), { activeClass: "text-[var(--espace-or)]" }), ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas text-lg" }, { class: (link.icon) }));
    if ((typeof link.badge === 'object' ? link.badge.value : link.badge) > -1) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign(Object.assign({ class: "cart-badge absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center" }, { class: ({
                'animate-scale': (link.to === '/collaborations' && __VLS_ctx.animateCollaborationBadge) || (link.to === '/messages' && __VLS_ctx.animateMessagesBadge),
            }) }), { 'aria-label': (link.to === '/collaborations'
                ? 'Collaborations en attente'
                : link.to === '/messages'
                    ? 'Messages non lus'
                    : '') }));
        (typeof link.badge === 'object' ? link.badge.value : link.badge);
    }
    var __VLS_7;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
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
            animateCollaborationBadge: animateCollaborationBadge,
            animateMessagesBadge: animateMessagesBadge,
            navLinks: navLinks,
        };
    },
});
exports.default = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
