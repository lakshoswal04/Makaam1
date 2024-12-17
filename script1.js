
        function updateMaxStreak(newStreak) {
            document.getElementById('max-streak').innerText = `${newStreak} Days`;
        }

        function updateProgress(newProgress) {
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            progressBar.value = newProgress;
            progressText.innerText = `${newProgress}%`;
        }

        function viewStatistics() {
            alert('Viewing statistics functionality coming soon!');
        }

        function addHabit() {
            alert('Add habit functionality coming soon!');
        }

        function removeHabit() {
            alert('Remove habit functionality coming soon!');
        }

        const calendarContent = document.getElementById('calendar-content');
        calendarContent.addEventListener('mouseenter', () => {
            calendarContent.innerText = 'Hovered over calendar! Dynamic data coming soon.';
        });
        calendarContent.addEventListener('mouseleave', () => {
            calendarContent.innerText = '[Calendar goes here]';
        });
 