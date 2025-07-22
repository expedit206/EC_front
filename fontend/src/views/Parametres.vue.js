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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const vue_router_1 = require("vue-router");
const Auth_1 = require("../stores/Auth");
const vue_toastification_1 = require("vue-toastification");
const FormField_vue_1 = __importDefault(require("../components/FormField.vue"));
const Loader_vue_1 = __importDefault(require("../components/Loader.vue"));
const api_1 = __importDefault(require("../api"));
const vue_2 = require("vue");
const isLoading = (0, vue_1.ref)(false);
const authStore = (0, Auth_1.useAuthStore)();
const router = (0, vue_router_1.useRouter)();
const toast = (0, vue_toastification_1.useToast)();
const user = authStore.user;
const activeSection = (0, vue_1.ref)('profile'); // Section active (profile, security, notifications, links)
const profileForm = (0, vue_1.ref)({
    nom: (user === null || user === void 0 ? void 0 : user.nom) || '',
    email: (user === null || user === void 0 ? void 0 : user.email) || '',
    telephone: (user === null || user === void 0 ? void 0 : user.telephone) || '',
    ville: (user === null || user === void 0 ? void 0 : user.ville) || '',
});
const passwordForm = (0, vue_1.ref)({
    current_password: '',
    new_password: '',
    confirm_password: '',
});
const notifications = (0, vue_1.ref)({
    email_notifications: (user === null || user === void 0 ? void 0 : user.email_notifications) || false,
    sms_notifications: (user === null || user === void 0 ? void 0 : user.sms_notifications) || false,
});
const passwordStrength = (0, vue_1.ref)(''); // Force du mot de passe
const settingsLinks = (0, vue_1.computed)(() => [
    ...((user === null || user === void 0 ? void 0 : user.commercant)
        ? [{ to: '/commercant', label: 'Espace Commerçant', icon: 'fa-store-alt', description: 'Gérez votre boutique et vos produits' }]
        : []),
    { to: '/parrainage', label: 'Parrainage', icon: 'fa-users', description: 'Invitez des amis et gagnez des récompenses' },
    { to: '/abonnements', label: 'Abonnements', icon: 'fa-star', description: 'Gérez vos abonnements premium' },
    { to: '/collaborations', label: 'Collaborations', icon: 'fa-handshake', description: 'Gérez vos collaborations sur des produits' },
]);
const updateProfile = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    isLoading.value = true;
    try {
        yield api_1.default.put('/user/profile', profileForm.value);
        authStore.user = Object.assign(Object.assign({}, authStore.user), profileForm.value);
        localStorage.setItem('user', JSON.stringify(authStore.user));
        toast.success('Profil mis à jour avec succès', { timeout: 3000 });
    }
    catch (error) {
        toast.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erreur lors de la mise à jour du profil');
    }
    finally {
        isLoading.value = false;
    }
});
const updatePassword = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    isLoading.value = true;
    try {
        if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }
        if (passwordStrength.value === 'weak') {
            toast.error('Le mot de passe est trop faible. Utilisez au moins 8 caractères avec des lettres, chiffres et symboles.');
            return;
        }
        yield api_1.default.put('/user/password', passwordForm.value);
        toast.success('Mot de passe mis à jour avec succès', { timeout: 3000 });
        passwordForm.value = { current_password: '', new_password: '', confirm_password: '' };
        passwordStrength.value = '';
    }
    catch (error) {
        toast.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erreur lors de la mise à jour du mot de passe');
    }
    finally {
        isLoading.value = false;
    }
});
const updateNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    isLoading.value = true;
    try {
        yield api_1.default.put('/user/notifications', notifications.value);
        authStore.user = Object.assign(Object.assign({}, authStore.user), notifications.value);
        localStorage.setItem('user', JSON.stringify(authStore.user));
        toast.success('Préférences de notification mises à jour', { timeout: 3000 });
    }
    catch (error) {
        toast.error(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Erreur lors de la mise à jour des notifications');
    }
    finally {
        isLoading.value = false;
    }
});
const logout = () => {
    authStore.logout();
    router.push({ name: 'login' });
};
// Calculer la force du mot de passe
const checkPasswordStrength = () => {
    const password = passwordForm.value.new_password;
    if (password.length === 0) {
        passwordStrength.value = '';
    }
    else if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        passwordStrength.value = 'weak';
    }
    else if (!/[!@#$%^&*]/.test(password)) {
        passwordStrength.value = 'medium';
    }
    else {
        passwordStrength.value = 'strong';
    }
};
// Mettre à jour la force du mot de passe en temps réel
(0, vue_2.watch)(() => passwordForm.value.new_password, checkPasswordStrength);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6 flex flex-col lg:flex-row gap-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)(Object.assign({ class: "hidden lg:block w-full max-w-xs bg-[var(--espace-blanc)] rounded-lg shadow-md p-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-xl font-semibold text-[var(--espace-vert)] mb-4 font-poppins" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)(Object.assign({ class: "space-y-2" }));
for (const [section] of __VLS_getVForSourceType(([
    { id: 'profile', label: 'Profil', icon: 'fa-user' },
    { id: 'security', label: 'Sécurité', icon: 'fa-lock' },
    { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
    { id: 'links', label: 'Autres options', icon: 'fa-cog' },
    { id: 'logout', label: 'Déconnexion', icon: 'fa-sign-out-alt' },
]))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign(Object.assign({ onClick: (...[$event]) => {
            section.id === 'logout' ? __VLS_ctx.logout() : (__VLS_ctx.activeSection = section.id);
        } }, { key: (section.id) }), { class: "w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-300" }), { class: ({
            'bg-[var(--espace-vert)] text-[var(--espace-blanc)]': __VLS_ctx.activeSection === section.id,
            'text-[var(--espace-vert)] hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]': __VLS_ctx.activeSection !== section.id,
        }) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas" }, { class: (section.icon) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "font-poppins" }));
    (section.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)(Object.assign({ class: "flex-1 bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 sm:p-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "lg:hidden mb-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex overflow-x-auto space-x-2 border-b border-[var(--espace-gris)]" }));
for (const [section] of __VLS_getVForSourceType(([
    { id: 'profile', label: 'Profil', icon: 'fa-user' },
    { id: 'security', label: 'Sécurité', icon: 'fa-lock' },
    { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
    { id: 'links', label: 'Autres', icon: 'fa-cog' },
    { id: 'logout', label: 'Déconnexion', icon: 'fa-sign-out-alt' },
]))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign(Object.assign({ onClick: (...[$event]) => {
            section.id === 'logout' ? __VLS_ctx.logout() : (__VLS_ctx.activeSection = section.id);
        } }, { key: (section.id) }), { class: "flex items-center gap-2 px-4 py-2 text-sm font-medium font-poppins transition-colors duration-300" }), { class: ({
            'border-b-2 border-[var(--espace-or)] text-[var(--espace-vert)]': __VLS_ctx.activeSection === section.id,
            'text-[var(--espace-gris)] hover:text-[var(--espace-vert)]': __VLS_ctx.activeSection !== section.id,
        }) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas" }, { class: (section.icon) }));
    (section.label);
}
const __VLS_3 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(__VLS_3, new __VLS_3({
    name: "slide",
}));
const __VLS_5 = __VLS_4({
    name: "slide",
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
if (__VLS_ctx.activeSection === 'profile') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(Object.assign({ class: "space-y-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-2xl font-bold text-[var(--espace-vert)] font-poppins" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "grid grid-cols-1 md:grid-cols-2 gap-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(Object.assign({ onSubmit: (__VLS_ctx.updateProfile) }, { class: "space-y-4" }));
    /** @type {[typeof FormField, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
        label: "Nom",
        icon: "fa-user",
        modelValue: (__VLS_ctx.profileForm.nom),
        type: "text",
        required: true,
        placeholder: "Votre nom",
    }));
    const __VLS_8 = __VLS_7({
        label: "Nom",
        icon: "fa-user",
        modelValue: (__VLS_ctx.profileForm.nom),
        type: "text",
        required: true,
        placeholder: "Votre nom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {[typeof FormField, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
        label: "Email",
        icon: "fa-envelope",
        modelValue: (__VLS_ctx.profileForm.email),
        type: "email",
        placeholder: "Votre email",
    }));
    const __VLS_11 = __VLS_10({
        label: "Email",
        icon: "fa-envelope",
        modelValue: (__VLS_ctx.profileForm.email),
        type: "email",
        placeholder: "Votre email",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    /** @type {[typeof FormField, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
        label: "Téléphone",
        icon: "fa-phone",
        modelValue: (__VLS_ctx.profileForm.telephone),
        type: "tel",
        required: true,
        placeholder: "Votre numéro de téléphone",
    }));
    const __VLS_14 = __VLS_13({
        label: "Téléphone",
        icon: "fa-phone",
        modelValue: (__VLS_ctx.profileForm.telephone),
        type: "tel",
        required: true,
        placeholder: "Votre numéro de téléphone",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {[typeof FormField, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
        label: "Ville",
        icon: "fa-city",
        modelValue: (__VLS_ctx.profileForm.ville),
        type: "text",
        required: true,
        placeholder: "Votre ville",
    }));
    const __VLS_17 = __VLS_16({
        label: "Ville",
        icon: "fa-city",
        modelValue: (__VLS_ctx.profileForm.ville),
        type: "text",
        required: true,
        placeholder: "Votre ville",
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ type: "submit" }, { class: "w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bg-gray-50 p-4 rounded-lg shadow-sm" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(Object.assign({ class: "text-lg font-semibold text-[var(--espace-vert)] mb-2 font-poppins" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex items-center gap-4 mb-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(Object.assign({ src: (((_b = (_a = __VLS_ctx.user) === null || _a === void 0 ? void 0 : _a.commercant) === null || _b === void 0 ? void 0 : _b.photo_url) || 'https://via.placeholder.com/50'), alt: "Photo de profil" }, { class: "w-12 h-12 rounded-full object-cover" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-[var(--espace-vert)] font-semibold" }));
    (__VLS_ctx.profileForm.nom || 'Nonni');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-sm text-[var(--espace-gris)]" }));
    (__VLS_ctx.profileForm.email || 'Non défini');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-sm text-[var(--espace-gris)]" }));
    (__VLS_ctx.profileForm.telephone || 'Nonni');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-sm text-[var(--espace-gris)]" }));
    (__VLS_ctx.profileForm.ville || 'Non défini');
}
var __VLS_6;
const __VLS_19 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    name: "slide",
}));
const __VLS_21 = __VLS_20({
    name: "slide",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
if (__VLS_ctx.activeSection === 'security') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(Object.assign({ class: "space-y-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-2xl font-bold text-[var(--espace-vert)] font-poppins" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(Object.assign({ onSubmit: (__VLS_ctx.updatePassword) }, { class: "space-y-4" }));
    /** @type {[typeof FormField, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
        label: "Mot de passe actuel",
        icon: "fa-lock",
        modelValue: (__VLS_ctx.passwordForm.current_password),
        type: "password",
        required: true,
        placeholder: "Mot de passe actuel",
    }));
    const __VLS_24 = __VLS_23({
        label: "Mot de passe actuel",
        icon: "fa-lock",
        modelValue: (__VLS_ctx.passwordForm.current_password),
        type: "password",
        required: true,
        placeholder: "Mot de passe actuel",
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    /** @type {[typeof FormField, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default(Object.assign({ 'onInput': {} }, { label: "Nouveau mot de passe", icon: "fa-lock", modelValue: (__VLS_ctx.passwordForm.new_password), type: "password", required: true, placeholder: "Nouveau mot de passe" })));
    const __VLS_27 = __VLS_26(Object.assign({ 'onInput': {} }, { label: "Nouveau mot de passe", icon: "fa-lock", modelValue: (__VLS_ctx.passwordForm.new_password), type: "password", required: true, placeholder: "Nouveau mot de passe" }), ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_29;
    let __VLS_30;
    let __VLS_31;
    const __VLS_32 = {
        onInput: (__VLS_ctx.checkPasswordStrength)
    };
    var __VLS_28;
    if (__VLS_ctx.passwordStrength) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "text-sm" }, { class: ({
                'text-red-500': __VLS_ctx.passwordStrength === 'weak',
                'text-yellow-500': __VLS_ctx.passwordStrength === 'medium',
                'text-green-500': __VLS_ctx.passwordStrength === 'strong',
            }) }));
        (__VLS_ctx.passwordStrength === 'weak' ? 'Faible' : __VLS_ctx.passwordStrength ===
            'medium' ? 'Moyen' : 'Fort');
    }
    /** @type {[typeof FormField, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(FormField_vue_1.default, new FormField_vue_1.default({
        label: "Confirmer le nouveau mot de passe",
        icon: "fa-lock",
        modelValue: (__VLS_ctx.passwordForm.confirm_password),
        type: "password",
        required: true,
        placeholder: "Confirmer le mot de passe",
    }));
    const __VLS_34 = __VLS_33({
        label: "Confirmer le nouveau mot de passe",
        icon: "fa-lock",
        modelValue: (__VLS_ctx.passwordForm.confirm_password),
        type: "password",
        required: true,
        placeholder: "Confirmer le mot de passe",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ type: "submit" }, { class: "w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105" }));
}
var __VLS_22;
const __VLS_36 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    name: "slide",
}));
const __VLS_38 = __VLS_37({
    name: "slide",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
if (__VLS_ctx.activeSection === 'notifications') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(Object.assign({ class: "space-y-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-2xl font-bold text-[var(--espace-vert)] font-poppins" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "space-y-4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "flex items-center gap-3 cursor-pointer" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign({ type: "checkbox" }, { class: "h-5 w-5 text-[var(--espace-vert)] rounded transition" }));
    (__VLS_ctx.notifications.email_notifications);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "text-sm text-[var(--espace-gris)] font-poppins" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "flex items-center gap-3 cursor-pointer" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign({ type: "checkbox" }, { class: "h-5 w-5 text-[var(--espace-vert)] rounded transition" }));
    (__VLS_ctx.notifications.sms_notifications);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "text-sm text-[var(--espace-gris)] font-poppins" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ onClick: (__VLS_ctx.updateNotifications) }, { class: "w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105" }));
}
var __VLS_39;
const __VLS_40 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    name: "slide",
}));
const __VLS_42 = __VLS_41({
    name: "slide",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
if (__VLS_ctx.activeSection === 'links') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(Object.assign({ class: "space-y-6" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-2xl font-bold text-[var(--espace-vert)] font-poppins" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "grid grid-cols-1 sm:grid-cols-2 gap-4" }));
    for (const [link] of __VLS_getVForSourceType((__VLS_ctx.settingsLinks))) {
        const __VLS_44 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44(Object.assign({ key: (link.to), to: (link.to) }, { class: "flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105" })));
        const __VLS_46 = __VLS_45(Object.assign({ key: (link.to), to: (link.to) }, { class: "flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105" }), ...__VLS_functionalComponentArgsRest(__VLS_45));
        __VLS_47.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)(Object.assign({ class: "fas" }, { class: (link.icon) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(Object.assign({ class: "text-base font-medium font-poppins" }));
        (link.label);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-sm text-[var(--espace-gris)]" }));
        (link.description);
        var __VLS_47;
    }
}
var __VLS_43;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:block']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-x-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['object-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-yellow-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-blanc)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-poppins']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-gris)]']} */ ;
var __VLS_dollars;
const __VLS_self = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {
            FormField: FormField_vue_1.default,
            Loader: Loader_vue_1.default,
            isLoading: isLoading,
            user: user,
            activeSection: activeSection,
            profileForm: profileForm,
            passwordForm: passwordForm,
            notifications: notifications,
            passwordStrength: passwordStrength,
            settingsLinks: settingsLinks,
            updateProfile: updateProfile,
            updatePassword: updatePassword,
            updateNotifications: updateNotifications,
            logout: logout,
            checkPasswordStrength: checkPasswordStrength,
        };
    },
});
exports.default = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
