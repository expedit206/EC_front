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
const Auth_1 = require("../stores/Auth");
const api_1 = __importDefault(require("../api"));
const vue_toastification_1 = require("vue-toastification");
const authStore = (0, Auth_1.useAuthStore)();
const router = (0, vue_router_1.useRouter)();
const toast = (0, vue_toastification_1.useToast)();
const code = (0, vue_1.ref)('');
const link = (0, vue_1.ref)('');
const parrainages = (0, vue_1.ref)([]);
const totalGains = (0, vue_1.ref)(0);
const suggestedCode = (0, vue_1.ref)('');
const customCode = (0, vue_1.ref)('');
const isGenerating = (0, vue_1.ref)(false);
const isCreating = (0, vue_1.ref)(false);
const fetchParrainageData = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter');
        router.push('/login');
        return;
    }
    try {
        const response = yield api_1.default.get('/parrainages/dashboard');
        const data = response.data;
        code.value = data.code;
        link.value = `https://espacecameroun.cm/invite/${data.code}`;
        parrainages.value = data.parrainages;
        totalGains.value = data.total_gains;
    }
    catch (error) {
        toast.error('Erreur lors du chargement des données de parrainage');
    }
});
const generateCodeSuggestion = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!authStore.user)
        return;
    isGenerating.value = true;
    try {
        const response = yield api_1.default.post('/parrainages/generate-suggestion');
        suggestedCode.value = response.data.suggested_code;
        customCode.value = suggestedCode.value;
        toast.success('Nouveau code suggéré !');
    }
    catch (error) {
        toast.error('Erreur lors de la génération du code');
    }
    finally {
        isGenerating.value = false;
    }
});
const createCode = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!authStore.user || !customCode.value)
        return;
    isCreating.value = true;
    try {
        const response = yield api_1.default.post('/parrainages/create', { code: customCode.value });
        code.value = response.data.code;
        link.value = response.data.link;
        toast.success(response.data.message);
        yield fetchParrainageData();
    }
    catch (error) {
        toast.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erreur lors de la création du code');
    }
    finally {
        isCreating.value = false;
    }
});
const shareLink = (platform) => {
    let url = '';
    switch (platform) {
        case 'whatsapp':
            url = `https://api.whatsapp.com/send?text=${encodeURIComponent(link.value)}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link.value)}`;
            break;
        default:
            toast.error('Plateforme non prise en charge');
            return;
    }
    window.open(url, '_blank');
};
(0, vue_1.onMounted)(() => {
    fetchParrainageData();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "container mx-auto max-w-4xl" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(Object.assign({ class: "text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6 font-poppins" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-users mr-2 text-[var(--espace-or)]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bg-white rounded-lg shadow-md p-4 mb-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-[var(--espace-gris)]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bg-white rounded-lg shadow-md p-4 mb-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-lg font-semibold text-[var(--espace-vert)] mb-2" }));
if (__VLS_ctx.code) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "mb-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-sm text-[var(--espace-gris)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "font-bold text-[var(--espace-or)]" }));
    (__VLS_ctx.code);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-sm text-[var(--espace-gris)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)(Object.assign({ href: (__VLS_ctx.link) }, { class: "text-blue-500 underline" }));
    (__VLS_ctx.link);
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "mb-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign({ value: (__VLS_ctx.customCode), type: "text", placeholder: (__VLS_ctx.suggestedCode || 'Entrez ou générez un code (ex: DOM2025)') }, { class: "w-full p-2 border rounded mb-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex gap-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (__VLS_ctx.generateCodeSuggestion) }, { disabled: (__VLS_ctx.isGenerating) }), { class: "bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-white transition flex-1" }));
    if (__VLS_ctx.isGenerating) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-spinner animate-spin mr-2" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-magic mr-2" }));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (__VLS_ctx.createCode) }, { disabled: (__VLS_ctx.isCreating || !__VLS_ctx.customCode) }), { class: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex-1" }));
    if (__VLS_ctx.isCreating) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-spinner animate-spin mr-2" }));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-check mr-2" }));
    }
}
if (__VLS_ctx.code) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "mt-4 flex gap-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ onClick: (...[$event]) => {
            if (!(__VLS_ctx.code))
                return;
            __VLS_ctx.shareLink('whatsapp');
        } }, { class: "bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fab fa-whatsapp mr-1" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ onClick: (...[$event]) => {
            if (!(__VLS_ctx.code))
                return;
            __VLS_ctx.shareLink('facebook');
        } }, { class: "bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fab fa-facebook-f mr-1" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bg-white rounded-lg shadow-md p-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-lg font-semibold text-[var(--espace-vert)] mb-4" }));
if (__VLS_ctx.parrainages.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "overflow-x-auto" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)(Object.assign({ class: "w-full text-sm text-left text-[var(--espace-gris)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)(Object.assign({ class: "bg-[var(--espace-vert)] text-[var(--espace-blanc)]" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(Object.assign({ class: "px-4 py-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(Object.assign({ class: "px-4 py-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(Object.assign({ class: "px-4 py-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)(Object.assign({ class: "px-4 py-2" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (const [p] of __VLS_getVForSourceType((__VLS_ctx.parrainages))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)(Object.assign({ key: (p.filleul_nom) }, { class: "border-b hover:bg-gray-50" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(Object.assign({ class: "px-4 py-2" }));
        (p.filleul_nom);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(Object.assign({ class: "px-4 py-2" }));
        (new Date(p.date_inscription).toLocaleDateString());
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(Object.assign({ class: "px-4 py-2" }));
        (p.est_commercant ? 'Oui' : 'Non');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)(Object.assign({ class: "px-4 py-2" }));
        (p.est_commercant ? p.ventes_generees : '-');
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-center text-[var(--espace-gris)] py-4" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bg-white rounded-lg shadow-md p-4 mt-6 text-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-lg font-semibold text-[var(--espace-vert)] mb-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-2xl font-bold text-[var(--espace-or)]" }));
(__VLS_ctx.totalGains);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-[var(--espace-gris)]" }));
(__VLS_ctx.parrainages.length);
(__VLS_ctx.parrainages.filter(p => p.est_commercant).length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-[var(--espace-gris)]" }));
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
/** @type {__VLS_StyleScopedClasses['fa-users']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['underline']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-magic']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-check']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['fab']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-whatsapp']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['fab']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-facebook-f']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
var __VLS_dollars;
const __VLS_self = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {
            code: code,
            link: link,
            parrainages: parrainages,
            totalGains: totalGains,
            suggestedCode: suggestedCode,
            customCode: customCode,
            isGenerating: isGenerating,
            isCreating: isCreating,
            generateCodeSuggestion: generateCodeSuggestion,
            createCode: createCode,
            shareLink: shareLink,
        };
    },
});
exports.default = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
