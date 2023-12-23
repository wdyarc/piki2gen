// Add a global variable to track the number of groups
var totalGroups = 0;

//Menetapkan event listener untuk semua elemen <button>. Ketika tombol diklik, fungsi yang ini untuk menjalankan/ membuat dan mengelola grup.
$('button').on('click', function (e) {
    e.preventDefault();
    //Mengambil nilai dari elemen dengan kelas .pergroup (jumlah nama per grup) dan elemen <textarea> (daftar nama).
    //Menghitung panjang total daftar nama.
    var namespergroup = parseInt($('.pergroup').val()),
    allnames = $('textarea').val().split('\n'),
    allnameslen = allnames.length;

    //Menghitung jumlah grup berdasarkan jumlah nama per grup.
    //Jika input dengan kelas .numgroups diisi, menggunakannya sebagai jumlah grup yang diinginkan.
    var numgroups = Math.ceil(allnameslen / namespergroup);

    if ($('.numgroups').val()) {
        numgroups = parseInt($('.numgroups').val());
        namespergroup = allnameslen / numgroups;
    }
    //Menghapus Konten Grup Sebelumnya[jika re-generate]
    $('.groups').empty();

    totalGroups = numgroups; // Set the initial total number of groups

    //Membuat Grup
    //Membuat elemen grup sebanyak jumlah grup yang dihitung sebelumnya.
    //Setiap grup memiliki elemen <button> untuk menghapus grup (deleteGroup) dan dua elemen lainnya untuk menambahkan nama anggota dan mengedit/menghapus nama anggota.
    for (i = 0; i < numgroups; i++) {
        var groupContent = '<div class="group" id="group' + (i + 1) + '"><button class="dltgroup" onclick="deleteGroup(this)"><i class="uil uil-times-square"></i></button> <h2>Group ' + (i + 1) + '<br></h2><input type="text" placeholder="Add Name" style="margin-left: 20px; padding: 8px 8px;"><button class="addnm" onclick="addMemberToGroup(this)" style="vertical-align: middle;"><i class="uil uil-plus-circle"></i></button></div>';
        $('.groups').append(groupContent);
    }
    
    //Mengisi setiap grup dengan nama-nama acak dari daftar nama.
    //Setiap nama memiliki elemen <button> untuk mengedit (editMember) dan menghapus (deleteMember) nama tersebut.
    $('.group').each(function() {
        for (j = 0; j < namespergroup; j++) {
            var randname = Math.floor(Math.random() * allnames.length);
            if (allnames[randname]) {
                var memberContent = '<p><span class="memberName">' + allnames[randname] +
                    '<br></span><button class="editBtn" style="color:blue" onclick="editMember(this)"><i class="uil uil-edit-alt"></i></button><button style="color:red" class="deleteBtn" onclick="deleteMember(this)"><i class="uil uil-trash-alt"></i></button></p>';
                $(this).append(memberContent);
            }
            allnames.splice(randname, 1);
        }
    });

    // Atur lebar grup sesuai dengan panjang kontennya
    $('.group').css('width', 'auto');
    var maxGroupWidth = Math.max.apply(null, $('.group').map(function () {
        return $(this).width();
    }).get());
    $('.group').width(maxGroupWidth);
});

//alert untuk user harus mengisi kolom input
$('#rnd').on('click', function() {
    // Get the values of pergroup and numgroups
    var pergroupValue = $('.pergroup').val().trim();
    var numgroupsValue = $('.numgroups').val().trim();
    var textareaValue = $('textarea').val().trim();

    // Count the number of lines in the textarea
    var lineCount = textareaValue.split('\n').length;

    // Check if either pergroup or numgroups is filled
    if (pergroupValue === "" && numgroupsValue === "") {
        // Show an alert if both pergroup and numgroups are empty
        alert('Please fill in either the "Number of people per Group" or "Number of Groups" column first.');
    } else {
        // Determine the maximum candidate count based on the number of lines in the textarea
        var maxCandidateCount = lineCount;

        // Check if pergroup exceeds the maximum candidate count
        if (pergroupValue !== "" && parseInt(pergroupValue) > maxCandidateCount) {
            alert('The Number of people per Group cannot exceed ' + maxCandidateCount + ' (the number of lines in the textarea).');
            $('.groups').empty();
            return; // Stop further processing
        }

        // Check if numgroups exceeds the maximum candidate count
        if (numgroupsValue !== "" && parseInt(numgroupsValue) > maxCandidateCount) {
            alert('The Number of Groups cannot exceed ' + maxCandidateCount + ' (the number of lines in the textarea).');
            $('.groups').empty();
            return; // Stop further processing
        }

        // Perform the desired action (you can add your logic here)
        // For example, you might want to generate groups based on the input values
        generateGroups(pergroupValue, numgroupsValue);
    }
});

//allert untuk user jika user sudah mengisi atau belum mengisi kolom input
function generateGroups(pergroup, numgroups) {

    if (pergroup !== "") {
        // Show an alert if "Banyaknya orang per Kelompok" is chosen
        alert('PIKIPIKI : Number of people per Group is ' + pergroup);
    } else if (numgroups !== "") {
        // Show an alert if "Jumlah Kelompok" is chosen
        alert('PIKIPIKI : Number of Groups created is ' + numgroups);
    } else {
        // Show a default alert if both are empty (this should not happen based on the previous logic)
        alert('PIKIPIKI Generated.');
    }
}

//fungsi toggle
$('.toggle-wrap a').on('click', function(e) {
    e.preventDefault();
    $('.wrap').toggleClass('alt');
    $('.pergroup-wrap, .numgroups-wrap').find('input').val('');
});


//fungsi clear result atau hasil dan alert untuk memastikan jika ingin delet
$('.clear-all-btn').on('click', function() {
    // Ask for confirmation using a dialog
    var confirmed = confirm('Are you sure you want to delete all group results?');

    // Check if the user clicked "OK"
    if (confirmed) {
        // Clear the content
        $('#boo').empty();
        $('.groups').empty();

        // Show an alert to inform the user that the data has been cleared
        alert('All results have been deleted.');
    }
    // If the user clicked "Cancel," nothing happens
});


//button delete grup
function deleteGroup(element) {
    var groupElement = $(element).parent();
    groupElement.remove(); // Remove the entire group

    // Decrement the total number of groups
    totalGroups--;

    // You may want to update the group numbers after deletion
    updateGroupNumbers();
}
//button jika grup terhapus,nilai sesudah grupnya akan berkurang
function updateGroupNumbers() {
    $('.group').each(function (index) {
        $(this).find('h2').text('Group ' + (index + 1));
    });
}

// Menambah fungsi edit member
function editMember(element) {
    var memberNameElement = $(element).siblings('.memberName');
    var currentName = memberNameElement.text();

    // Simpan posisi tombol
    var editBtn = $(element).siblings('.editBtn');
    var deleteBtn = $(element).siblings('.deleteBtn');
    var btnPosition = editBtn.position();

    var newName = prompt('Edit Member Name:', currentName);

    if (newName !== null) {
        memberNameElement.html(newName +'<br>' );
        
        // Kembalikan posisi tombol
        editBtn.css('position', 'relative');
        deleteBtn.css('position', 'relative');
        editBtn.offset(btnPosition);
        deleteBtn.offset(btnPosition);
    }
}

// Menambah fungsi delete member
function deleteMember(element) {
    $(element).parent().remove();
}


// Menambah fungsi untuk menambah anggota ke grup
function addMemberToGroup(element) {
    var groupElement = $(element).parent();
    var memberName = groupElement.find('input').val();
    if (memberName.trim() !== "") {
        var memberContent = '<p><span class="memberName">' + memberName +
            '<br></span><button class="editBtn" style="color:blue" onclick="editMember(this)"><i class="uil uil-edit-alt"></i></button><button class="deleteBtn" style="color:red" onclick="deleteMember(this)"><i class="uil uil-trash-alt"></i></button></p>';
        groupElement.append(memberContent);
        groupElement.find('input').val('');
    }
}

//untuk nama judul kelompok dan user tidak mengosongkan nilainya jika buttonnya terclick
function getValue() {
    // Get the value of the "foo" input
    var inputValue = document.getElementById('foo').value.trim();
    var resultContainer = document.getElementById('boo');

    // Check if the input is not empty
    if (inputValue !== "") {
        // Check if the input contains at least one number and one alphabet
        var containsNumbersAndAlphabets = /^(?=.*\d)(?=.*[a-zA-Z])/.test(inputValue);

        // Check if the input meets the criteria
        if (containsNumbersAndAlphabets && inputValue.length <= 20) {
            // Display the input in the result container
            resultContainer.innerHTML = inputValue;
            // Display an alert to inform the user that the data has been received
            alert('Hello!\nThe Group Title is ' + inputValue + '.\nIf you want to change the title, please refill on the Group Name field again.');
        } else {
            // Display a warning alert if the input doesn't meet the criteria
            alert('Make sure you have entered a valid Group Title:\n- It should contain both numbers and alphabets.\n- It should not exceed 20 characters.');
        }
    } else {
        // Display a warning alert if the input is empty
        alert('Make sure you have entered the Group Title!');
    }
}




