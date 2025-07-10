// script.js
// 模擬測驗完成後儲存進度
function completeQuiz(userRole, score) {
    let progress = JSON.parse(localStorage.getItem('progress')) || {
      student: 0,
      teacher: 0,
      parent: 0
    };
    if (userRole === '學生') progress.student = score;
    if (userRole === '教師') progress.teacher = score;
    if (userRole === '家長') progress.parent = score;
    localStorage.setItem('progress', JSON.stringify(progress));
  }
  
  // 示例：學生完成測驗，得分 80%
  completeQuiz('學生', 80);