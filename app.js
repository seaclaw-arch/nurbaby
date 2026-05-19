// Konfigurasi Supabase
const SUPABASE_URL = 'https://ycmbvotfmxijznonetpm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_56wQ5Elt7GbQwZ2d2iS-cQ_69QvJYAo';

// Inisialisasi Supabase Client (hanya 1 kali)
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const authForm = document.getElementById('auth-form');
const authBtn = document.getElementById('auth-btn');
const logoutBtn = document.getElementById('logout-btn');
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const authMessage = document.getElementById('auth-message');
const userName = document.getElementById('user-name');
const childrenList = document.getElementById('children-list');
const addChildBtn = document.getElementById('add-child-btn');

// State
let currentUser = null;
let isSignUp = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupEventListeners();
});

// Check authentication status
async function checkAuthStatus() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
        currentUser = data.session.user;
        showApp();
        loadChildren();
    } else {
        showAuth();
    }
}

// Setup event listeners
function setupEventListeners() {
    authForm.addEventListener('submit', handleAuth);
    logoutBtn.addEventListener('click', handleLogout);
    addChildBtn.addEventListener('click', () => {
        alert('Fitur tambah anak akan segera hadir!');
    });
}

// Handle authentication (login/signup)
async function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    authMessage.textContent = 'Loading...';
    authMessage.className = '';
    
    try {
        // Coba login terlebih dahulu
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (loginError) {
            // Jika login gagal, coba sign up
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password
            });
            
            if (signUpError) {
                throw signUpError;
            }
            
            authMessage.textContent = 'Akun berhasil dibuat! Silahkan cek email Anda untuk konfirmasi, atau langsung login.';
            authMessage.className = 'success';
            authForm.reset();
        } else {
            // Login berhasil
            currentUser = loginData.session.user;
            authMessage.textContent = 'Login berhasil!';
            authMessage.className = 'success';
            showApp();
            loadChildren();
            authForm.reset();
        }
    } catch (error) {
        console.error('Auth error:', error);
        authMessage.textContent = 'Error: ' + error.message;
        authMessage.className = 'error';
    }
}

// Handle logout
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
            authMessage.textContent = 'Error logout: ' + error.message;
            authMessage.className = 'error';
        } else {
            currentUser = null;
            showAuth();
            authForm.reset();
            authMessage.textContent = '';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Show authentication section
function showAuth() {
    authSection.style.display = 'block';
    appSection.style.display = 'none';
    authBtn.textContent = 'Login';
    isSignUp = false;
}

// Show app section
function showApp() {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    userName.textContent = currentUser.email;
}

// Load children data
async function loadChildren() {
    try {
        const { data, error } = await supabase
            .from('children')
            .select('*')
            .eq('parent_id', currentUser.id);
        
        if (error) {
            console.warn('Tabel children belum ada atau RLS policy belum dikonfigurasi:', error);
            childrenList.innerHTML = '<p style="color: #999;">Belum ada data anak.</p>';
            return;
        }
        
        if (data.length === 0) {
            childrenList.innerHTML = '<p style="color: #999;">Belum ada data anak. Tambahkan anak pertama Anda!</p>';
        } else {
            childrenList.innerHTML = data.map(child => `
                <div class="child-item">
                    <h3>${child.name}</h3>
                    <p>Umur: ${child.age || 'Belum diisi'} tahun</p>
                    <p>Lahir: ${child.birth_date || 'Belum diisi'}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading children:', error);
        childrenList.innerHTML = '<p style="color: red;">Error loading data: ' + error.message + '</p>';
    }
}

// Listen for auth state changes
supabase.auth.onAuthStateChanged((event, session) => {
    if (event === 'SIGNED_IN') {
        currentUser = session.user;
        showApp();
        loadChildren();
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        showAuth();
    }
});
