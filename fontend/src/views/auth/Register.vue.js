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
const Auth_ts_1 = require("../../stores/Auth.ts");
const FormField_vue_1 = __importDefault(require("../../components/FormField.vue"));
const form = (0, vue_1.ref)({
    nom: '',
    telephone: '',
    email: '',
    ville: '',
    mot_de_passe: '',
    parrain_id: '',
});
const errors = (0, vue_1.ref)({});
const router = (0, vue_router_1.useRouter)();
const toast = (0, vue_toastification_1.useToast)();
const authStore = (0, Auth_ts_1.useAuthStore)();
const register = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        console.log('Envoi des données d\'inscription:', form.value);
        yield authStore.register(form.value);
        toast.success('Inscription réussie !');
        router.push({ name: 'home' });
    }
    catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        const message = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erreur lors de l\'inscription. Veuillez vérifier vos informations.';
        toast.error(message);
        if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 422) {
            errors.value = error.response.data.errors;
        }
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "overflow-y-scroll bg-white flex justify-center px-4 " }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: " flex  flex-col w-full max-w-lg  rounded-2xl  pb-16 sm:p-10" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)(Object.assign({ class: "text-3xl sm:text-4xl font-bold text-center text-[var(--espace-vert)] mb-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-user-plus mr-2 text-[var(--espace-or)]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-center text-sm sm:text-base text-gray-600 mb-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(Object.assign({ onSubmit: (__VLS_ctx.register) }, { class: " space-y-5" }));
/** @type {[typeof FormField, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
    label: "Nom",
    icon: "fa-user",
    modelValue: (__VLS_ctx.form.nom),
    type: "text",
    required: true,
    error: (__VLS_ctx.errors.nom),
}));
const __VLS_1 = __VLS_0({
    label: "Nom",
    icon: "fa-user",
    modelValue: (__VLS_ctx.form.nom),
    type: "text",
    required: true,
    error: (__VLS_ctx.errors.nom),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof FormField, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
    label: "Téléphone",
    icon: "fa-phone",
    modelValue: (__VLS_ctx.form.telephone),
    type: "tel",
    required: true,
    error: (__VLS_ctx.errors.telephone),
}));
const __VLS_4 = __VLS_3({
    label: "Téléphone",
    icon: "fa-phone",
    modelValue: (__VLS_ctx.form.telephone),
    type: "tel",
    required: true,
    error: (__VLS_ctx.errors.telephone),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof FormField, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
    label: "Email (optionnel)",
    icon: "fa-envelope",
    modelValue: (__VLS_ctx.form.email),
    type: "email",
    error: (__VLS_ctx.errors.email),
}));
const __VLS_7 = __VLS_6({
    label: "Email (optionnel)",
    icon: "fa-envelope",
    modelValue: (__VLS_ctx.form.email),
    type: "email",
    error: (__VLS_ctx.errors.email),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {[typeof FormField, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
    label: "Ville",
    icon: "fa-city",
    modelValue: (__VLS_ctx.form.ville),
    type: "text",
    required: true,
    error: (__VLS_ctx.errors.ville),
}));
const __VLS_10 = __VLS_9({
    label: "Ville",
    icon: "fa-city",
    modelValue: (__VLS_ctx.form.ville),
    type: "text",
    required: true,
    error: (__VLS_ctx.errors.ville),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {[typeof FormField, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
    label: "Mot de passe",
    icon: "fa-lock",
    modelValue: (__VLS_ctx.form.mot_de_passe),
    type: "password",
    required: true,
    error: (__VLS_ctx.errors.mot_de_passe),
}));
const __VLS_13 = __VLS_12({
    label: "Mot de passe",
    icon: "fa-lock",
    modelValue: (__VLS_ctx.form.mot_de_passe),
    type: "password",
    required: true,
    error: (__VLS_ctx.errors.mot_de_passe),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {[typeof FormField, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
    label: "Code de parrainage (optionnel)",
    icon: "fa-users",
    modelValue: (__VLS_ctx.form.parrain_id),
    type: "text",
    error: (__VLS_ctx.errors.parrain_id),
}));
const __VLS_16 = __VLS_15({
    label: "Code de parrainage (optionnel)",
    icon: "fa-users",
    modelValue: (__VLS_ctx.form.parrain_id),
    type: "text",
    error: (__VLS_ctx.errors.parrain_id),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ type: "submit" }, { class: "w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-3 rounded-xl hover:bg-[var(--espace-vert)] hover:text-white transition flex items-center justify-center shadow-md" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas fa-user-plus mr-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-center text-sm text-gray-600 mt-6" }));
const __VLS_18 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18(Object.assign({ to: "/login" }, { class: "text-[var(--espace-vert)] font-medium hover:underline" })));
const __VLS_20 = __VLS_19(Object.assign({ to: "/login" }, { class: "text-[var(--espace-vert)] font-medium hover:underline" }), ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_21.slots.default;
var __VLS_21;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-center text-xs text-gray-400 mt-2 pb-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)(Object.assign({ href: "/conditions" }, { class: "hover:underline text-[var(--espace-vert)]" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)(Object.assign({ href: "/confidentialite" }, { class: "hover:underline text-[var(--espace-vert)]" }));
/** @type {__VLS_StyleScopedClasses['overflow-y-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-user-plus']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-user-plus']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
var __VLS_dollars;
const __VLS_self = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {
            FormField: FormField_vue_1.default,
            form: form,
            errors: errors,
            register: register,
        };
    },
});
exports.default = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
