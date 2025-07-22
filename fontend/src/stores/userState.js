"use strict";
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
exports.useUserStateStore = void 0;
const pinia_1 = require("pinia");
const vue_1 = require("vue");
const api_1 = __importDefault(require("../api"));
const vue_toastification_1 = require("vue-toastification");
exports.useUserStateStore = (0, pinia_1.defineStore)("userState", () => {
    const collaborationsPending = (0, vue_1.ref)(0);
    const toast = (0, vue_toastification_1.useToast)();
    // Initialiser l'état (collaborations)
    const initializeState = () => {
        const pendingCollaborations = JSON.parse(localStorage.getItem("pending_collaborations") || "[]");
        collaborationsPending.value = pendingCollaborations.length;
    };
    // Sauvegarder les collaborations
    const saveCollaborationsToLocalStorage = (collaborations) => {
        localStorage.setItem("pending_collaborations", JSON.stringify(collaborations));
        collaborationsPending.value = collaborations.length;
    };
    // Ajouter une collaboration
    const addCollaboration = (collaboration) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const pendingCollaborations = JSON.parse(localStorage.getItem("pending_collaborations") || "[]");
        pendingCollaborations.push({
            produit_id: collaboration.produit_id,
            prix_revente: collaboration.prix_revente,
            status: "pending",
            created_at: new Date().toISOString(),
        });
        saveCollaborationsToLocalStorage(pendingCollaborations);
        try {
            yield api_1.default.post("/collaborations", {
                produit_id: collaboration.produit_id,
                prix_revente: collaboration.prix_revente,
            });
            yield syncCollaborationsWithBackend();
            toast.success("Demande de collaboration envoyée !");
            return true;
        }
        catch (error) {
            const updatedCollaborations = pendingCollaborations.filter((item) => !(item.produit_id === collaboration.produit_id &&
                item.prix_revente === collaboration.prix_revente));
            saveCollaborationsToLocalStorage(updatedCollaborations);
            toast.error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.message) ||
                "Erreur lors de la demande de collaboration");
            return false;
        }
    });
    // Synchroniser les collaborations
    const syncCollaborationsWithBackend = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield api_1.default.get("/collaborations");
            const backendCollaborations = response.data.filter((item) => item.status === "pending");
            saveCollaborationsToLocalStorage(backendCollaborations.map((item) => ({
                produit_id: item.produit_id,
                prix_revente: item.prix_revente,
                status: item.status,
                created_at: item.created_at,
            })));
        }
        catch (error) {
            console.error("Erreur lors de la synchronisation des collaborations:", error);
        }
    });
    // Vider l'état
    const clearState = () => {
        localStorage.removeItem("pending_collaborations");
        collaborationsPending.value = 0;
    };
    return {
        collaborationsPending,
        initializeState,
        addCollaboration,
        syncCollaborationsWithBackend,
        clearState,
        saveCollaborationsToLocalStorage,
    };
});
