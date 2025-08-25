document.addEventListener('DOMContentLoaded', () => {
    // กำหนดค่าความจุแต่ละส่วนและค่าเริ่มต้นเป็นลิตร
    let currentVolumeM = 0;
    let currentVolumeH = 0;
    const MAX_VOLUME_M = 15000; // 15 ลูกบาศก์เมตร = 15000 ลิตร
    const MAX_VOLUME_H = 20000; // 20 ลูกบาศก์เมตร = 20000 ลิตร
    let history = [];

    // เลือกองค์ประกอบที่เกี่ยวข้อง
    const totalVolumeEl = document.getElementById('total-volume');
    const MVolumeEl = document.getElementById('M-volume');
    const HVolumeEl = document.getElementById('H-volume');
    const fuelLevelMEl = document.getElementById('M-level');
    const fuelLevelHEl = document.getElementById('H-level');
    const addVolumeInput = document.getElementById('add-volume-input');
    const removeVolumeInput = document.getElementById('remove-volume-input');
    const addMButton = document.getElementById('add-M-button');
    const addHButton = document.getElementById('add-H-button');
    const removeMButton = document.getElementById('remove-M-button');
    const removeHButton = document.getElementById('remove-H-button');
    const historyTableBody = document.querySelector('#history-table tbody');
    const userNameInput = document.getElementById('user-name-input');

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงใน localStorage
    function saveData() {
        localStorage.setItem('fuelAppCurrentVolumeM', currentVolumeM);
        localStorage.setItem('fuelAppCurrentVolumeH', currentVolumeH);
        localStorage.setItem('fuelAppHistory', JSON.stringify(history));
    }

    // ฟังก์ชันสำหรับโหลดข้อมูลจาก localStorage
    function loadData() {
        const savedVolumeM = localStorage.getItem('fuelAppCurrentVolumeM');
        const savedVolumeH = localStorage.getItem('fuelAppCurrentVolumeH');
        const savedHistory = localStorage.getItem('fuelAppHistory');

        if (savedVolumeM !== null) {
            currentVolumeM = parseFloat(savedVolumeM);
        }
        if (savedVolumeH !== null) {
            currentVolumeH = parseFloat(savedVolumeH);
        }
        if (savedHistory !== null) {
            history = JSON.parse(savedHistory);
            history.forEach(entry => addHistoryEntryToTable(entry.type, entry.amount, entry.remainingVolume, entry.user, false));
        }

        updateUI();
    }

    // ฟังก์ชันสำหรับอัปเดต UI (แสดงผล)
    function updateUI() {
        const totalVolume = currentVolumeM + currentVolumeH;
        totalVolumeEl.textContent = `${totalVolume.toLocaleString()} ลิตร`;
        MVolumeEl.textContent = `${currentVolumeM.toLocaleString()} ลิตร`;
        HVolumeEl.textContent = `${currentVolumeH.toLocaleString()} ลิตร`;
        
        const fuelPercentageM = (currentVolumeM / MAX_VOLUME_M) * 100;
        const fuelPercentageH = (currentVolumeH / MAX_VOLUME_H) * 100;
        fuelLevelMEl.style.height = `${fuelPercentageM}%`;
        fuelLevelHEl.style.height = `${fuelPercentageH}%`;
    }

    // ฟังก์ชันสำหรับเพิ่มรายการในประวัติ
    function addHistoryEntry(type, amount) {
        const user = userNameInput.value.trim() || 'ไม่ระบุ';
        const remainingVolume = currentVolumeM + currentVolumeH;
        const newEntry = {
            date: new Date().toLocaleString('th-TH'),
            type: type,
            amount: amount,
            remainingVolume: remainingVolume,
            user: user
        };
        history.unshift(newEntry);
        addHistoryEntryToTable(type, amount, remainingVolume, user, true);
        saveData(); // บันทึกข้อมูลทันที
    }

    // ฟังก์ชันสำหรับเพิ่มรายการในตาราง
    function addHistoryEntryToTable(type, amount, remainingVolume, user, isNew) {
        const newRow = historyTableBody.insertRow(isNew ? 0 : historyTableBody.rows.length);
        
        const dateCell = newRow.insertCell(0);
        const typeCell = newRow.insertCell(1);
        const amountCell = newRow.insertCell(2);
        const remainingCell = newRow.insertCell(3);
        const userCell = newRow.insertCell(4);

        dateCell.textContent = new Date().toLocaleString('th-TH');
        typeCell.textContent = type;
        amountCell.textContent = `${amount.toLocaleString()}`;
        remainingCell.textContent = `${remainingVolume.toLocaleString()}`;
        userCell.textContent = user;
    }

    // เหตุการณ์เมื่อคลิกปุ่ม "เติม M"
    addMButton.addEventListener('click', () => {
        const volumeToAdd = parseFloat(addVolumeInput.value);
        if (isNaN(volumeToAdd) || volumeToAdd <= 0) {
            alert('กรุณากรอกปริมาณน้ำมันที่ถูกต้อง (ต้องมากกว่า 0)');
            return;
        }
        
        if (currentVolumeM + volumeToAdd > MAX_VOLUME_M) {
            alert('ไม่สามารถเติมได้! ปริมาณน้ำมันจะเกินความจุของถัง M');
            return;
        }

        currentVolumeM += volumeToAdd;
        addHistoryEntry(`เติม M`, volumeToAdd);
        updateUI();
        addVolumeInput.value = '';
    });

    // เหตุการณ์เมื่อคลิกปุ่ม "เติม H"
    addHButton.addEventListener('click', () => {
        const volumeToAdd = parseFloat(addVolumeInput.value);
        if (isNaN(volumeToAdd) || volumeToAdd <= 0) {
            alert('กรุณากรอกปริมาณน้ำมันที่ถูกต้อง (ต้องมากกว่า 0)');
            return;
        }
        
        if (currentVolumeH + volumeToAdd > MAX_VOLUME_H) {
            alert('ไม่สามารถเติมได้! ปริมาณน้ำมันจะเกินความจุของถัง H');
            return;
        }

        currentVolumeH += volumeToAdd;
        addHistoryEntry(`เติม H`, volumeToAdd);
        updateUI();
        addVolumeInput.value = '';
    });

    // เหตุการณ์เมื่อคลิกปุ่ม "นำออก M"
    removeMButton.addEventListener('click', () => {
        const volumeToRemove = parseFloat(removeVolumeInput.value);
        if (isNaN(volumeToRemove) || volumeToRemove <= 0) {
            alert('กรุณากรอกปริมาณน้ำมันที่ถูกต้อง (ต้องมากกว่า 0)');
            return;
        }

        if (currentVolumeM - volumeToRemove < 0) {
            alert('ไม่สามารถนำน้ำมันออกได้! ปริมาณน้ำมันในถัง M ไม่เพียงพอ');
            return;
        }
        
        currentVolumeM -= volumeToRemove;
        addHistoryEntry(`นำออก M`, volumeToRemove);
        updateUI();
        removeVolumeInput.value = '';
    });

    // เหตุการณ์เมื่อคลิกปุ่ม "นำออก H"
    removeHButton.addEventListener('click', () => {
        const volumeToRemove = parseFloat(removeVolumeInput.value);
        if (isNaN(volumeToRemove) || volumeToRemove <= 0) {
            alert('กรุณากรอกปริมาณน้ำมันที่ถูกต้อง (ต้องมากกว่า 0)');
            return;
        }

        if (currentVolumeH - volumeToRemove < 0) {
            alert('ไม่สามารถนำน้ำมันออกได้! ปริมาณน้ำมันในถัง H ไม่เพียงพอ');
            return;
        }
        
        currentVolumeH -= volumeToRemove;
        addHistoryEntry(`นำออก H`, volumeToRemove);
        updateUI();
        removeVolumeInput.value = '';
    });

    // เรียกฟังก์ชันเพื่อโหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
    loadData();
});
