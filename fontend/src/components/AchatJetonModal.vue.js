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
const index_js_1 = __importDefault(require("../api/index.js"));
const vue_toastification_1 = require("vue-toastification");
const __VLS_props = defineProps();
const emit = defineEmits(["close", "purchased"]);
const toast = (0, vue_toastification_1.useToast)();
const jetonQuantity = (0, vue_1.ref)(10);
const phoneNumber = (0, vue_1.ref)("");
const selectedService = (0, vue_1.ref)("");
const montant = (0, vue_1.ref)(jetonQuantity.value * 25);
const loading = (0, vue_1.ref)(false);
const serviceError = (0, vue_1.ref)(false);
const phoneError = (0, vue_1.ref)(false);
const paymentServices = [
    {
        value: "ORANGE",
        label: "Orange Money",
        logo: new URL("../assets/images/logo/orange.png", import.meta.url).href,
    },
    {
        value: "MTN",
        label: "MTN Mobile Money",
        logo: new URL("../assets/images/logo/mtn.jpg", import.meta.url).href,
    },
];
const presetQuantities = [10, 20, 50, 100];
const isFormValid = (0, vue_1.computed)(() => {
    return (jetonQuantity.value >= 10 &&
        phoneNumber.value.trim().length === 9 &&
        /^6\d{8}$/.test(phoneNumber.value) && // Validation simple : commence par 6, 9 chiffres
        selectedService.value !== "");
});
const updateMontant = () => {
    montant.value = jetonQuantity.value * 25;
};
const setQuantity = (qty) => {
    jetonQuantity.value = qty;
    updateMontant();
};
const onQuantityInput = () => {
    updateMontant();
};
const validatePhoneNumber = () => {
    phoneError.value = !(phoneNumber.value.trim().length === 9 && /^6\d{8}$/.test(phoneNumber.value));
};
const acheterJetons = () => __awaiter(void 0, void 0, void 0, function* () {
    serviceError.value = !selectedService.value;
    if (!isFormValid.value) {
        toast.error("Veuillez remplir tous les champs correctement.");
        return;
    }
    loading.value = true;
    try {
        const res = yield index_js_1.default.post("/acheter-jetons", {
            nombre_jetons: jetonQuantity.value,
            payment_service: selectedService.value,
            phone_number: phoneNumber.value,
        });
        toast.success(res.data.message);
        emit("purchased", jetonQuantity.value);
        emit("close");
    }
    catch (e) {
        if (e.response && e.response.data) {
            const errorData = e.response.data;
            toast.error(`Erreur: ${errorData.error_message || "Achat échoué"}. Détails: ${errorData.details || "Aucun détail."}`);
        }
        else {
            toast.error("Erreur lors de l'achat. Veuillez réessayer.");
        }
        console.error(e);
    }
    finally {
        loading.value = false;
    }
});
(0, vue_1.watch)(phoneNumber, () => {
    validatePhoneNumber();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-fade-in max-h-[90vh] overflow-auto" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(Object.assign({ class: "text-3xl font-extrabold text-[var(--espace-vert)] text-center" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-center text-gray-600 text-sm mb-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex justify-center gap-3 mb-4" }));
for (const [preset] of __VLS_getVForSourceType((__VLS_ctx.presetQuantities))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (...[$event]) => {
            __VLS_ctx.setQuantity(preset);
        } }, { key: (preset), type: "button" }), { class: ([
            'rounded-full px-4 py-2 border font-semibold transition',
            __VLS_ctx.jetonQuantity === preset
                ? 'bg-[var(--espace-vert)] text-white border-[var(--espace-vert)]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-[var(--espace-vert)] hover:text-white',
        ]) }));
    (preset);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "block text-gray-700 font-semibold mb-1" }, { for: "jetonQuantity" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "text-sm text-gray-500" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign(Object.assign({ onInput: (__VLS_ctx.onQuantityInput) }, { id: "jetonQuantity", type: "number", min: "10", placeholder: "Ex: 10" }), { class: "w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition" }));
(__VLS_ctx.jetonQuantity);
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "block text-gray-700 font-semibold mb-1 mt-4" }, { for: "phoneNumber" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "text-sm text-red-500" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign(Object.assign({ onInput: (__VLS_ctx.validatePhoneNumber) }, { id: "phoneNumber", type: "tel", placeholder: "Ex: 696428651" }), { class: ([
        'w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition',
        __VLS_ctx.phoneError ? 'border-red-500' : 'border-gray-300',
    ]) }));
(__VLS_ctx.phoneNumber);
if (__VLS_ctx.phoneError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-xs text-red-600 mt-1" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign({ class: "block text-gray-700 font-semibold mb-2 mt-4" }, { for: "paymentService" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "flex gap-4" }));
for (const [service] of __VLS_getVForSourceType((__VLS_ctx.paymentServices))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(Object.assign(Object.assign({ key: (service.value) }, { class: "flex items-center gap-3 cursor-pointer rounded-lg border p-3 flex-1 transition hover:border-[var(--espace-vert)]" }), { class: ({
            'border-[var(--espace-vert)] bg-[var(--espace-vert)]/10': __VLS_ctx.selectedService === service.value,
            'border-gray-300 bg-white': __VLS_ctx.selectedService !== service.value,
        }) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)(Object.assign({ type: "radio", value: (service.value) }, { class: "hidden" }));
    (__VLS_ctx.selectedService);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)(Object.assign({ src: (service.logo), alt: "" }, { class: "h-8 w-8 object-contain" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: ({
            'text-[var(--espace-vert)] font-bold': __VLS_ctx.selectedService === service.value,
            'text-gray-700': __VLS_ctx.selectedService !== service.value,
        }) }));
    (service.label);
}
if (__VLS_ctx.serviceError && !__VLS_ctx.selectedService) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(Object.assign({ class: "text-xs text-red-600 mt-1" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "text-center text-lg font-bold mt-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "text-[var(--espace-vert)]" }));
(__VLS_ctx.montant);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign(Object.assign({ onClick: (__VLS_ctx.acheterJetons) }, { disabled: (!__VLS_ctx.isFormValid || __VLS_ctx.loading) }), { class: "w-full mt-4 bg-[var(--espace-vert)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--espace-or)] transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3" }));
if (!__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)(Object.assign({ class: "animate-spin h-5 w-5 text-white" }, { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)(Object.assign({ class: "opacity-25" }, { cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)(Object.assign({ class: "opacity-75" }, { fill: "currentColor", d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ class: "w-full mt-2 text-center text-gray-500 hover:text-[var(--espace-vert)] transition" }));
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(Object.assign({ 'onClick': {} }, { to: "/jeton-history" })));
const __VLS_2 = __VLS_1(Object.assign({ 'onClick': {} }, { to: "/jeton-history" }), ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (...[$event]) => {
        __VLS_ctx.emit('close');
    }
};
__VLS_3.slots.default;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[90vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:border-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]/10']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-8']} */ ;
/** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-[var(--espace-or)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-[var(--espace-vert)]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
var __VLS_dollars;
const __VLS_self = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {
            emit: emit,
            jetonQuantity: jetonQuantity,
            phoneNumber: phoneNumber,
            selectedService: selectedService,
            montant: montant,
            loading: loading,
            serviceError: serviceError,
            phoneError: phoneError,
            paymentServices: paymentServices,
            presetQuantities: presetQuantities,
            isFormValid: isFormValid,
            setQuantity: setQuantity,
            onQuantityInput: onQuantityInput,
            validatePhoneNumber: validatePhoneNumber,
            acheterJetons: acheterJetons,
        };
    },
    emits: {},
    __typeProps: {},
});
exports.default = (await Promise.resolve().then(() => __importStar(require('vue')))).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
