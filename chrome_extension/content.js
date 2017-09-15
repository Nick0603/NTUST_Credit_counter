function copyObjectedArray( array ){
    var newArray = [];
    for(var i=0 ; i<array.length ; i++){
        var newItem = {};
        $.extend(newItem,array[i]);
        newArray.push(newItem);
    }
    return newArray; 
}

var courseCounter = {
    ObligatoryCourses:null,
    learnedCourses:null,
    classifiedCourses:null,
    mergeObligatoryCourse:function( dispersedCourse ){
        var mergeCourse = [];
        var years = ["FirstYear","SecondYear","ThirdYear"];
        years.forEach(function( year ){
            var courses = dispersedCourse[year];
            courses.forEach(function(course){
                mergeCourse.push(course);
            })
        });
        return mergeCourse;
    },
    parserCourseInfo: function ( course ){
        var cleanCourse = {};
        // 區隔錯誤表格資料
        if( course.childElementCount < 7){
            return null;
        }
        // 暑期修課
        if( course.childElementCount == 7){
            cleanCourse.semester = 0;
            cleanCourse.code  = course.children[1].innerText;
            cleanCourse.name = course.children[2].innerText;
            cleanCourse.grade = course.children[4].innerText;
            cleanCourse.credit = parseInt(course.children[3].innerText);
            return cleanCourse;
        }
        // 抵免、免修課
        if( course.children[2].innerText == "抵免" || course.children[2].innerText == "免修"){
            // 取的學期 0=>不分學期 1=>上學期  2=>下學期   e.g.: 1031 => 取得個位數數字
            cleanCourse.semester = parseInt(course.children[1].innerText) % 10;
            cleanCourse.code  = course.children[3].innerText;
            cleanCourse.name = course.children[4].innerText;
            cleanCourse.grade = course.children[2].innerText;
            // special_format :  1 學分、 2學分 "" 空白就當0學分
            cleanCourse.credit = parseInt(course.children[7].innerText[0]);
            if(isNaN(cleanCourse.credit)){
                cleanCourse.credit = 0
            }
            return cleanCourse;
        }
        // 一般學期時段選修課程
        cleanCourse.semester =  parseInt(course.children[1].innerText) % 10;
        cleanCourse.code  = course.children[2].innerText;
        cleanCourse.name = course.children[3].innerText;
        cleanCourse.grade = course.children[5].innerText;
        cleanCourse.credit = parseInt(course.children[4].innerText);
        // 分類出通識向度
        var category = course.children[7].innerText;
        if(  "A".charCodeAt(0) <= category.charCodeAt(0) && category.charCodeAt(0) <= "G".charCodeAt(0)){
            cleanCourse.category = course.children[7].innerText;
        }
        return cleanCourse;
    },
    parserCourses:function(){
        var learnedCourses = $("tr[bgcolor='white'");
        var cleanCourses = [];
        for(let i=0 ; i<learnedCourses.length ; i++){
            var course = learnedCourses[i];
            var cleanCourse = courseCounter.parserCourseInfo( course );
            if( cleanCourse != null){
                cleanCourses.push( cleanCourse );
            }
        }
        return cleanCourses;
    },
    classifyParserCourse:function(courses){
        var coursesCopy = copyObjectedArray(courses);

        // find Common Course
        var commonCourses = [];
        for(let i=coursesCopy.length-1 ; i>= 0 ; i--){
            var course = coursesCopy[i];
            if(course.category != null){
                var courseCopy = {};
                $.extend(courseCopy,coursesCopy[i]);
                commonCourses.push( courseCopy );
                coursesCopy.splice(i,1);
                
            }
        }

        // find PE Courses
        var PECourses = [];
        for(let i=coursesCopy.length-1 ; i>= 0 ; i--){
            var course = coursesCopy[i];
            if(course.name.indexOf("體育") != -1){
                var courseCopy = {};
                $.extend(courseCopy,coursesCopy[i]);
                PECourses.push( courseCopy );
                coursesCopy.splice(i,1);
            }
        }
        
        // find literatureCourses
        var literatureCourses = [];
        for(let i=coursesCopy.length-1 ; i>= 0 ; i--){
            var course = coursesCopy[i];
            if(course.code.indexOf("CC12") != -1){
                var courseCopy = {};
                $.extend(courseCopy,coursesCopy[i]);
                literatureCourses.push( courseCopy );
                coursesCopy.splice(i,1);
            }
        }

        // find EnglishCourses
        var EnglishCourses = [];
        for(let i=coursesCopy.length-1 ; i>= 0 ; i--){
            var course = coursesCopy[i];
            if(course.code.indexOf("FE") != -1 || course.code.indexOf("CC10") != -1){
                var courseCopy = {};
                $.extend(courseCopy,coursesCopy[i]);
                EnglishCourses.push( courseCopy );
                coursesCopy.splice(i,1);
            }
        }

        // find ObligatoryCourses
        var ObligatoryCourses = [];
        for(let i=0; i<courseCounter.ObligatoryCourses.length ; i++){
            var ObligatoryCourse = courseCounter.ObligatoryCourses[i];
            for( let j=0 ; j<coursesCopy.length ; j++){
                var course = coursesCopy[j];
                if(course.name.indexOf(ObligatoryCourse.name) != -1 ){
                    var courseCopy = {};
                    $.extend(courseCopy,coursesCopy[j]);
                    ObligatoryCourses.push( courseCopy );
                    coursesCopy.splice(j,1);
                    // break;  因為可能重修或同名所以遍布完全部
                }
            }
        }
        // find optionalCourses
        var optionalCourses = [];
        for(let i=coursesCopy.length-1 ; i>= 0 ; i--){
            var course = coursesCopy[i];
            if(course.code.indexOf("ME") != -1){
                var courseCopy = {};
                $.extend(courseCopy,coursesCopy[i]);
                optionalCourses.push( courseCopy );
                coursesCopy.splice(i,1);
            }
        }
        
        // otherCourse
        var otherCourses = coursesCopy;
        return {
            "commonCourses":commonCourses,
            "PECourses":PECourses,
            "literatureCourses":literatureCourses,
            "EnglishCourses":EnglishCourses,
            "ObligatoryCourses":ObligatoryCourses,
            "optionalCourses":optionalCourses,
            "coursesCopy":otherCourses
        }
    }
}


courseCounter.ObligatoryCourses = courseCounter.mergeObligatoryCourse(courses.major.course);
courseCounter.learnedCourses = courseCounter.parserCourses();
courseCounter.classifiedCourses = courseCounter.classifyParserCourse( courseCounter.learnedCourses );
console.log("-------courses--------");
console.log(courses);
console.log("------learnedCourses----------");
console.log(courseCounter.learnedCourses);
console.log("------ObligatoryCourse----------");
console.log(courseCounter.ObligatoryCourses); 
console.log("------classifiedCourses----------");
console.log(courseCounter.classifiedCourses); 

view.addPageContent();
view.updateGraduationCredit();


