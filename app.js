// Konfigurasi Supabase
const SUPABASE_URL = 'https://ycmbvotfmxijznonetpm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_56wQ5Elt7GbQwZ2d2iS-cQ_69QvJYAo';

// Inisialisasi Supabase Client
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
    
    // Toggle between login and signup
    authBtn.addEventListener('click', (e) => {
        if (isSignUp) {
            authBtn.textContent = 'Sign Up';
            isSignUp = false;
        }
    });
}

// Handle authentication
async function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    authMessage.textContent = 'Loading...';
    authMessage.className = '';
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            // Jika login gagal, coba sign up
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password
            });
            
            if (signUpError) {
                throw signUpError;
            }
            
            authMessage.textContent = 'Akun berhasil dibuat! Silahkan login.';
            authMessage.className = 'success';
            isSignUp = true;
        } else {
            currentUser = data.session.user;
            authMessage.textContent = 'Login berhasil!';
            authMessage.className = 'success';
            showApp();
            loadChildren();
            authForm.reset();
        }
    } catch (error) {
        authMessage.textContent = 'Error: ' + error.message;
        authMessage.className = 'error';
    }
}

// Handle logout
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
    } else {
        currentUser = null;
        showAuth();
        authForm.reset();
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
        // Ganti 'children' dengan nama tabel Anda di Supabase
        const { data, error } = await supabase
            .from('children')
            .select('*')
            .eq('parent_id', currentUser.id);
        
        if (error) {
            console.warn('Tabel children belum ada. Silahkan buat di Supabase dashboard.');
            childrenList.innerHTML = '<p style="color: #999;">Belum ada data anak.</p>';
            return;
        }
        
        if (data.length === 0) {
            childrenList.innerHTML = '<p style="color: #999;">Belum ada data anak. Tambahkan anak pertama Anda!</p>';
        } else {
            childrenList.innerHTML = data.map(child => `
                <div class="child-item">
                    <h3>${child.name}</h3>
                    <p>Umur: ${child.age} tahun</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading children:', error);
    }
}

// Listen for auth changes
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