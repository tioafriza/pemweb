import axios from "axios";

// Environment-based configuration with fallbacks
const getApiBaseUrl = () => {
  // Priority: REACT_APP_API_BASE_URL > REACT_APP_BACKEND_URL > BACKEND_URL > fallbacks
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL + "/api";
  }

  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL + "/api";
  }

  // Development fallback - prioritize Docker/Podman setup
  if (process.env.NODE_ENV === "development") {
    // Docker/Podman setup (current active setup)
    return "http://localhost:8080/api";
  }

  // Production fallback
  return "/api";
};

const API_BASE_URL = getApiBaseUrl();

// Configuration object for better management
const config = {
  apiBaseUrl: API_BASE_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  holidayApiUrl:
    process.env.REACT_APP_HOLIDAY_API_URL ||
    "https://api-harilibur.vercel.app/api",
  holidayApiTimeout:
    parseInt(process.env.REACT_APP_HOLIDAY_API_TIMEOUT) || 5000,
  retryAttempts: 3,
  retryDelay: 1000,
};

console.log("🔧 API Configuration:", {
  baseUrl: config.apiBaseUrl,
  environment: process.env.NODE_ENV,
  timeout: config.timeout,
});

// Konfigurasi axios default
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Retry function for failed requests
const retryRequest = async (fn, retries = config.retryAttempts) => {
  try {
    return await fn();
  } catch (error) {
    if (
      retries > 0 &&
      (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT")
    ) {
      console.warn(
        `🔄 Retrying request... (${config.retryAttempts - retries + 1}/${
          config.retryAttempts
        })`
      );
      await new Promise((resolve) => setTimeout(resolve, config.retryDelay));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// Interceptor untuk handling error secara global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };

    console.error("🚨 API Error:", errorInfo);

    // Add user-friendly error messages
    if (error.code === "ECONNREFUSED") {
      error.userMessage =
        "Backend server tidak dapat diakses. Pastikan server berjalan.";
    } else if (error.code === "ETIMEDOUT") {
      error.userMessage = "Request timeout. Periksa koneksi internet Anda.";
    } else if (error.response?.status === 404) {
      error.userMessage = "Endpoint tidak ditemukan.";
    } else if (error.response?.status >= 500) {
      error.userMessage = "Terjadi kesalahan pada server.";
    } else {
      error.userMessage = "Terjadi kesalahan yang tidak diketahui.";
    }

    return Promise.reject(error);
  }
);

// Generic REST client for resource endpoints
const resourceEndpoints = {
  jadwal: '/jadwal.php',
  kategori: '/kategori.php',
  lokasi: '/lokasi.php',
};

// Generic CRUD handler
async function apiRequest({ method, resource, id, data, params }) {
  const url =
    id !== undefined && id !== null
      ? `${resourceEndpoints[resource]}${method === 'get' ? `?id=${id}` : ''}`
      : resourceEndpoints[resource];

  try {
    const configObj = { params };
    if (method === 'delete') {
      configObj.data = { id };
    }
    const response =
      method === 'get'
        ? await apiClient.get(url, configObj)
        : method === 'post'
        ? await apiClient.post(url, data, configObj)
        : method === 'put'
        ? await apiClient.put(url, data, configObj)
        : method === 'delete'
        ? await apiClient.delete(url, configObj)
        : null;
    return response.data;
  } catch (error) {
    console.error(`API error [${method.toUpperCase()} ${resource}]`, error);
    throw error;
  }
}

class ApiService {
  /**
   * Mengambil semua jadwal
   * @returns {Promise} Promise yang resolve dengan data jadwal
   */
  // Jadwal
  static async getAllJadwal() {
    return retryRequest(() => apiRequest({ method: 'get', resource: 'jadwal' }));
  }

  /**
   * Mengambil jadwal berdasarkan ID
   * @param {number} id - ID jadwal
   * @returns {Promise} Promise yang resolve dengan data jadwal
   */
  static async getJadwalById(id) {
    return retryRequest(() => apiRequest({ method: 'get', resource: 'jadwal', id }));
  }

  /**
   * Menambah jadwal baru
   * @param {Object} jadwalData - Data jadwal yang akan ditambahkan
   * @param {string} jadwalData.kegiatan - Nama kegiatan
   * @param {string} jadwalData.tanggal - Tanggal kegiatan (format: YYYY-MM-DD)
   * @returns {Promise} Promise yang resolve dengan hasil operasi
   */
  static async createJadwal(jadwalData) {
    return retryRequest(() => apiRequest({ method: 'post', resource: 'jadwal', data: jadwalData }));
  }

  /**
   * Memperbarui jadwal
   * @param {Object} jadwalData - Data jadwal yang akan diperbarui
   * @param {number} jadwalData.id - ID jadwal
   * @param {string} jadwalData.kegiatan - Nama kegiatan
   * @param {string} jadwalData.tanggal - Tanggal kegiatan (format: YYYY-MM-DD)
   * @returns {Promise} Promise yang resolve dengan hasil operasi
   */
  static async updateJadwal(jadwalData) {
    return retryRequest(() => apiRequest({ method: 'put', resource: 'jadwal', data: jadwalData }));
  }

  /**
   * Menghapus jadwal
   * @param {number} id - ID jadwal yang akan dihapus
   * @returns {Promise} Promise yang resolve dengan hasil operasi
   */
  static async deleteJadwal(id) {
    return retryRequest(() => apiRequest({ method: 'delete', resource: 'jadwal', id }));
  }

  // Kategori
  static async getAllKategori() {
    return retryRequest(() => apiRequest({ method: 'get', resource: 'kategori' }));
  }
  static async getKategoriById(id) {
    return retryRequest(() => apiRequest({ method: 'get', resource: 'kategori', id }));
  }
  static async createKategori(data) {
    return retryRequest(() => apiRequest({ method: 'post', resource: 'kategori', data }));
  }
  static async updateKategori(data) {
    return retryRequest(() => apiRequest({ method: 'put', resource: 'kategori', data }));
  }
  static async deleteKategori(id) {
    return retryRequest(() => apiRequest({ method: 'delete', resource: 'kategori', id }));
  }

  // Lokasi
  static async getAllLokasi() {
    return retryRequest(() => apiRequest({ method: 'get', resource: 'lokasi' }));
  }
  static async getLokasiById(id) {
    return retryRequest(() => apiRequest({ method: 'get', resource: 'lokasi', id }));
  }
  static async createLokasi(data) {
    return retryRequest(() => apiRequest({ method: 'post', resource: 'lokasi', data }));
  }
  static async updateLokasi(data) {
    return retryRequest(() => apiRequest({ method: 'put', resource: 'lokasi', data }));
  }
  static async deleteLokasi(id) {
    return retryRequest(() => apiRequest({ method: 'delete', resource: 'lokasi', id }));
  }

  /**
   * Utility function untuk format tanggal
   * @param {string} dateString - String tanggal
   * @returns {string} Tanggal dalam format yang readable
   */
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Utility function untuk validasi format tanggal
   * @param {string} dateString - String tanggal (YYYY-MM-DD)
   * @returns {boolean} True jika format valid
   */
  static isValidDateFormat(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateString);
  }

  /**
   * Utility function untuk cek apakah tanggal sudah lewat
   * @param {string} dateString - String tanggal (YYYY-MM-DD)
   * @returns {boolean} True jika tanggal sudah lewat
   */
  static isPastDate(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
  }
}

export default ApiService;
