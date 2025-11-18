// Datos de ejemplo para el sistema
const sampleData = {
    appointments: [
        { id: 1, patientName: "Carlos Mendoza", doctorName: "Dr. Juan Pérez", specialty: "Medicina General", date: "2023-11-15", time: "10:00", status: "confirmada" },
        { id: 2, patientName: "Ana López", doctorName: "Dra. María García", specialty: "Cardiología", date: "2023-11-15", time: "11:30", status: "confirmada" },
        { id: 3, patientName: "Roberto Silva", doctorName: "Dr. Carlos Rodríguez", specialty: "Dermatología", date: "2023-11-16", time: "09:00", status: "pendiente" },
        { id: 4, patientName: "María Torres", doctorName: "Dr. Juan Pérez", specialty: "Medicina General", date: "2023-11-16", time: "14:00", status: "confirmada" },
        { id: 5, patientName: "Javier Ruiz", doctorName: "Dra. Laura Mendoza", specialty: "Pediatría", date: "2023-11-17", time: "10:30", status: "confirmada" }
    ],
    doctors: [
        { id: 1, name: "Dr. Juan Pérez", specialty: "Medicina General", email: "jperez@caverosalud.pe", status: "activo", appointments: 12 },
        { id: 2, name: "Dra. María García", specialty: "Cardiología", email: "mgarcia@caverosalud.pe", status: "activo", appointments: 8 },
        { id: 3, name: "Dr. Carlos Rodríguez", specialty: "Dermatología", email: "crodriguez@caverosalud.pe", status: "activo", appointments: 5 },
        { id: 4, name: "Dra. Laura Mendoza", specialty: "Pediatría", email: "lmendoza@caverosalud.pe", status: "activo", appointments: 10 }
    ],
    patients: [
        { id: 1, name: "Carlos Mendoza", email: "carlos@ejemplo.com", phone: "987654321", lastAppointment: "2023-10-15" },
        { id: 2, name: "Ana López", email: "ana@ejemplo.com", phone: "987654322", lastAppointment: "2023-10-20" },
        { id: 3, name: "Roberto Silva", email: "roberto@ejemplo.com", phone: "987654323", lastAppointment: "2023-11-05" },
        { id: 4, name: "María Torres", email: "maria@ejemplo.com", phone: "987654324", lastAppointment: "2023-11-10" }
    ]
};

// Aplicación principal
class CaveroSaludApp {
    constructor() {
        this.currentUser = null;
        this.userType = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
        console.log('CaveroSalud Digital inicializado');
    }

    bindEvents() {
        // Selección de tipo de usuario
        document.querySelectorAll('.user-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const userType = e.currentTarget.getAttribute('data-user-type');
                this.loginAsUser(userType);
            });
        });

        // Botones de demo e información
        document.getElementById('demoBtn')?.addEventListener('click', () => {
            document.getElementById('userTypeSelector').scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('moreInfoBtn')?.addEventListener('click', () => {
            this.showNotification('Para más información, contacta con nuestro equipo de soporte.', 'info');
        });

        // Botones de logout
        document.getElementById('adminLogoutBtn')?.addEventListener('click', () => this.logout());
        document.getElementById('doctorLogoutBtn')?.addEventListener('click', () => this.logout());
        document.getElementById('patientLogoutBtn')?.addEventListener('click', () => this.logout());
    }

    checkAuth() {
        // En una app real, verificaría tokens de autenticación
        const savedUser = localStorage.getItem('caverosalud_currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.userType = this.currentUser.type;
            this.showDashboard(this.userType);
        }
    }

    loginAsUser(userType) {
        this.userType = userType;
        
        // Ocultar selector de usuario
        document.getElementById('userTypeSelector').style.display = 'none';
        
        // Mostrar dashboard correspondiente
        this.showDashboard(userType);
        
        this.showNotification(`Has iniciado sesión como ${userType}`, 'success');
    }

    showDashboard(userType) {
        // Ocultar todos los dashboards primero
        document.querySelectorAll('.dashboard').forEach(dash => {
            dash.style.display = 'none';
        });

        // Mostrar el dashboard correspondiente
        const dashboard = document.getElementById(`${userType}Dashboard`);
        if (dashboard) {
            dashboard.style.display = 'block';
            this.loadDashboardData(userType);
        }
    }

    loadDashboardData(userType) {
        switch(userType) {
            case 'admin':
                this.loadAdminDashboard();
                break;
            case 'doctor':
                this.loadDoctorDashboard();
                break;
            case 'patient':
                this.loadPatientDashboard();
                break;
        }
    }

    loadAdminDashboard() {
        // Implementar carga de datos para admin
        const stats = this.calculateAdminStats();
        this.updateAdminStats(stats);
        this.renderAdminAppointments();
        this.renderAdminDoctors();
    }

    loadDoctorDashboard() {
        // Implementar carga de datos para médico
        const randomDoctor = sampleData.doctors[Math.floor(Math.random() * sampleData.doctors.length)];
        this.renderDoctorData(randomDoctor);
    }

    loadPatientDashboard() {
        // Implementar carga de datos para paciente
        const randomPatient = sampleData.patients[Math.floor(Math.random() * sampleData.patients.length)];
        this.renderPatientData(randomPatient);
    }

    calculateAdminStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = sampleData.appointments.filter(apt => apt.date === today).length;
        
        return {
            totalAppointments: sampleData.appointments.length,
            totalDoctors: sampleData.doctors.length,
            totalPatients: sampleData.patients.length,
            todayAppointments: todayAppointments
        };
    }

    updateAdminStats(stats) {
        document.getElementById('totalAppointments').textContent = stats.totalAppointments;
        document.getElementById('totalDoctors').textContent = stats.totalDoctors;
        document.getElementById('totalPatients').textContent = stats.totalPatients;
        document.getElementById('todayAppointments').textContent = stats.todayAppointments;
    }

    renderAdminAppointments() {
        const appointmentsList = document.getElementById('adminAppointmentsList');
        appointmentsList.innerHTML = '';
        
        sampleData.appointments.slice(0, 5).forEach(appointment => {
            const appointmentItem = document.createElement('li');
            appointmentItem.className = 'appointment-item';
            appointmentItem.innerHTML = this.createAppointmentHTML(appointment);
            appointmentsList.appendChild(appointmentItem);
        });
    }

    renderAdminDoctors() {
        const doctorsList = document.getElementById('adminDoctorsList');
        doctorsList.innerHTML = '';
        
        sampleData.doctors.forEach(doctor => {
            const doctorItem = document.createElement('li');
            doctorItem.className = 'doctor-item';
            doctorItem.innerHTML = this.createDoctorHTML(doctor);
            doctorsList.appendChild(doctorItem);
        });
    }

    createAppointmentHTML(appointment) {
        return `
            <div class="appointment-info">
                <h4>${appointment.specialty}</h4>
                <p>${appointment.patientName} con ${appointment.doctorName}</p>
                <p>${this.formatDate(appointment.date)} - ${appointment.time}</p>
            </div>
            <div class="appointment-actions">
                <span class="badge">${appointment.status}</span>
            </div>
        `;
    }

    createDoctorHTML(doctor) {
        return `
            <div class="doctor-info">
                <h4>${doctor.name}</h4>
                <p>${doctor.specialty}</p>
                <p>${doctor.appointments} citas programadas</p>
            </div>
            <div class="doctor-actions">
                <button class="btn btn-sm btn-outline">Editar</button>
            </div>
        `;
    }

    renderDoctorData(doctor) {
        document.getElementById('doctorName').textContent = doctor.name;
        document.getElementById('doctorSpecialty').textContent = doctor.specialty;
        
        const doctorAppointments = sampleData.appointments.filter(apt => apt.doctorName === doctor.name);
        this.updateDoctorStats(doctorAppointments);
        this.renderDoctorAppointments(doctorAppointments);
    }

    updateDoctorStats(appointments) {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(apt => apt.date === today).length;
        const uniquePatients = new Set(appointments.map(apt => apt.patientName)).size;

        document.getElementById('doctorAppointmentsToday').textContent = todayAppointments;
        document.getElementById('doctorAppointmentsWeek').textContent = appointments.length;
        document.getElementById('doctorPatients').textContent = uniquePatients;
        document.getElementById('doctorAvailability').textContent = '85%';
    }

    renderDoctorAppointments(appointments) {
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(apt => apt.date === today);
        const upcomingAppointments = appointments.filter(apt => apt.date !== today).slice(0, 3);

        this.renderAppointmentList('doctorTodayAppointments', todayAppointments, 'No hay citas programadas para hoy.');
        this.renderAppointmentList('doctorUpcomingAppointments', upcomingAppointments, 'No hay próximas citas programadas.');
    }

    renderAppointmentList(containerId, appointments, emptyMessage) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        if (appointments.length === 0) {
            container.innerHTML = `<p>${emptyMessage}</p>`;
            return;
        }

        appointments.forEach(appointment => {
            const item = document.createElement('li');
            item.className = 'appointment-item';
            item.innerHTML = this.createAppointmentHTML(appointment);
            container.appendChild(item);
        });
    }

    renderPatientData(patient) {
        document.getElementById('patientName').textContent = patient.name;
        document.getElementById('patientEmail').textContent = patient.email;
        
        const patientAppointments = sampleData.appointments.filter(apt => apt.patientName === patient.name);
        this.renderPatientAppointments(patientAppointments);
    }

    renderPatientAppointments(appointments) {
        const container = document.getElementById('patientAppointmentsList');
        container.innerHTML = '';

        if (appointments.length === 0) {
            container.innerHTML = '<p>No tienes citas programadas.</p>';
            return;
        }

        appointments.forEach(appointment => {
            const item = document.createElement('li');
            item.className = 'appointment-item';
            item.innerHTML = this.createPatientAppointmentHTML(appointment);
            container.appendChild(item);
        });
    }

    createPatientAppointmentHTML(appointment) {
        return `
            <div class="appointment-info">
                <h4>${appointment.specialty}</h4>
                <p>${appointment.doctorName}</p>
                <p>${this.formatDate(appointment.date)} - ${appointment.time}</p>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-sm btn-danger">Cancelar</button>
            </div>
        `;
    }

    logout() {
        this.currentUser = null;
        this.userType = null;
        localStorage.removeItem('caverosalud_currentUser');
        
        // Ocultar todos los dashboards
        document.querySelectorAll('.dashboard').forEach(dash => {
            dash.style.display = 'none';
        });
        
        // Mostrar selector de usuario
        document.getElementById('userTypeSelector').style.display = 'block';
        
        this.showNotification('Sesión cerrada correctamente', 'info');
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CaveroSaludApp();
});
