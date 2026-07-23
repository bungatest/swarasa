/**
 * db.js - Versi Bersih (Tanpa Backend Server)
 * 
 * Sesuai evaluasi, aplikasi ini 100% mampu berjalan murni di sisi klien (client-side)
 * menggunakan localStorage bawaan browser.
 * 
 * File ini dibersihkan dari fungsi `fetch()` ke localhost:3000 agar kode tidak 
 * membingungkan untuk deployment ke GitHub Pages. Semua pemanggilan database 
 * sekarang akan dengan aman diteruskan (fallback) ke localStorage di masing-masing 
 * file HTML (vendor.html, penerima.html, bgn.html).
 */

const SmartMBG_DB = null; // Dikosongkan secara sengaja untuk memicu fallback localStorage di HTML

// Fungsi getDB() lokal di file HTML akan mengembalikan null jika SmartMBG tidak terdefinisi.
// Jika file ini dipanggil, tidak ada konflik, dan fallback ke localStorage akan bekerja sempurna.
