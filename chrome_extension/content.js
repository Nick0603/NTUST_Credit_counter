function copyObjectedArray( array ){
    var newArray = [];
    for(var i=0 ; i<array.length ; i++){
        var newItem = {};
        $.extend(newItem,array[i]);
        newArray.push(newItem);
    }
    return newArray; 
}
function ObjectIndexOf(obj,objArray,checkKeys,startIndex){
    if(startIndex==undefined)startIndex=0;
    for(let i=startIndex ; i<objArray.length ; i++){
        var checkObj = objArray[i];
        var successCheckCounter = 0;
        
        checkKeys.forEach(function(key){

            if( typeof(obj[key]) == "string"){
                if(checkObj[key].indexOf(obj[key]) != -1){
                    successCheckCounter++;
                }
            }else{
                if(checkObj[key] == obj[key]){
                    successCheckCounter++;
                }
            }
        })
        if(successCheckCounter == checkKeys.length){
            return i;
        }
    }
    return -1;
}

function ObjectIndexOfAll(obj,objArray,checkKeys){
    var indexes = [], i = -1;
    while ((i = ObjectIndexOf(obj,objArray,checkKeys,i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

var courseCounter = {
    obligatoryCourses:null,
    optionalCourses:null,
    otherCourses:null,
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
    getCoursePassStatus:function(courses){
        // 可能有重修，需多重判斷多個重複課程
        if(courses.length == 0){
            return "未修課";
        }
        var status = "未知";
        for(let i=0 ;i<courses.length ;i++){
            var course = courses[i];
            var grade = course.grade;
            if(course.isCounted)continue;

            if( grade.indexOf("抵免") != -1 || grade.indexOf("免修") != -1 ){
                course.isCounted = true;
                return grade;
            }else if(grade.charCodeAt(0) <= "C".charCodeAt(0)){
                course.isCounted = true;
                return "通過";
            }else{
                course.isCounted = true;
                status = "未通過";
            }
        }
        return status;
    },
    getCorusesPassCredit:function(courses,targetCredit,containsWords){
        var creditCounter = 0;
        for(let i=0;i<courses.length;i++){
            var course = courses[i];
            var grade = course.grade;
            if(course.isCounted)continue;
            if(containsWords != null){
                if(course.code.indexOf( containsWords ) == -1)continue;
            }
            if(creditCounter >= targetCredit)break;
            
            if( grade.indexOf("抵免") != -1 || grade.indexOf("免修") != -1 ){
                course.isCounted = true;
                creditCounter += course.credit;
            }else if(grade.charCodeAt(0) <= "C".charCodeAt(0)){
                course.isCounted = true;
                creditCounter += course.credit;
            }
        }
        return creditCounter;
    },
    getCoursesByIndexes:function(courses,indexes){
        var findCourses = [];
        for(let i=0 ; i<indexes.length ; i++){
            findCourses.push( courses[ indexes[i] ] );
        }
        return findCourses;
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

        // find obligatoryCourses
        var obligatoryCourses = [];
        for(let i=0; i<courseCounter.obligatoryCourses.length ; i++){
            var obligatoryCourse = courseCounter.obligatoryCourses[i];
            for( let j=coursesCopy.length-1 ; j>=0 ; j--){
                var course = coursesCopy[j];
                if(course.name.indexOf(obligatoryCourse.name) != -1 ){
                    var courseCopy = {};
                    $.extend(courseCopy,coursesCopy[j]);
                    obligatoryCourses.push( courseCopy );
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
            "obligatoryCourses":obligatoryCourses,
            "optionalCourses":optionalCourses,
            "otherCourses":otherCourses
        }
    },
    checkGraduationCredit:function(){

        var otherCourse = [];

        // check English
        var graduationCourses = courses.English.course;
        var learnedCourses = courseCounter.classifiedCourses.EnglishCourses;
        for(let i=0 ;i<graduationCourses.length;i++){
            var course = graduationCourses[i];
            if(course.name =="校定英文能力會考"){
                course.status = "未知";
            }else if(course.name =="高階英文"){
                var indexes = ObjectIndexOfAll({code:"FE"},learnedCourses,["code"]);
                var findLearnedCourses = courseCounter.getCoursesByIndexes(learnedCourses,indexes);
                course.status = courseCounter.getCoursePassStatus(findLearnedCourses);
            }else{
                var indexes = ObjectIndexOfAll(course,learnedCourses,["name"]);
                var findLearnedCourses = courseCounter.getCoursesByIndexes(learnedCourses,indexes);
                course.status = courseCounter.getCoursePassStatus(findLearnedCourses);
            }
        }
        // check common
        var graduationCourses = courses.common.course;
        var literatureCourses = courseCounter.classifiedCourses.literatureCourses;
        var PECourses = courseCounter.classifiedCourses.PECourses;
        var commonCourses = courseCounter.classifiedCourses.commonCourses;
        for(let i=0 ;i<graduationCourses.length;i++){
            var course = graduationCourses[i];
            if(course.name =="文學領域"){
                course.status = courseCounter.getCoursePassStatus(literatureCourses);
            }else if(course.name =="體育"){
                course.status = courseCounter.getCoursePassStatus(PECourses);
            }else if(course.name =="通識"){
                // 通識統計 16學分 不分向度
                var commonCreditCounter = courseCounter.getCorusesPassCredit(commonCourses,course.credit);
                if(commonCreditCounter >= course.credit){
                    course.status = "通過(" + commonCreditCounter + ")";
                }else{
                    course.status = "未通過(" + commonCreditCounter + ")";
                }
            }
        }

        // check obligatory
        var graduationCourses = courseCounter.obligatoryCourses
        var obligatoryCourses = courseCounter.classifiedCourses.obligatoryCourses;
        for(let i=0 ;i<graduationCourses.length;i++){
            var course = graduationCourses[i];
            var indexes = ObjectIndexOfAll(course,obligatoryCourses,["name"]);
            var findLearnedCourses = courseCounter.getCoursesByIndexes(obligatoryCourses,indexes);
            course.status = courseCounter.getCoursePassStatus(findLearnedCourses);
        }

        // obligatory overed Courses  =>  optionalCourses  or otherCourses 
        for(let i=0 ; i<obligatoryCourses.length ; i++){
            var course = obligatoryCourses[i];
            if( !course.isCounted ){
                var courseCopy = {};
                $.extend(courseCopy,course);
                obligatoryCourses.splice(i,1);
                if(course.code.indexOf("ME")){
                    courseCounter.classifiedCourses.optionalCourses.push( courseCopy );
                }else{
                    courseCounter.classifiedCourses.otherCourses.push( courseCopy );
                }
            }
        }

        // check optional
        var graduationCourses = courseCounter.optionalCourses;
        var optionalCourses = courseCounter.classifiedCourses.optionalCourses;
        for(let i=0 ;i<graduationCourses.length;i++){
            var course = graduationCourses[i];
            if(course.name ==  "實習課程" ){
                var indexes = ObjectIndexOfAll({name:"實習"},optionalCourses,["name"]);
                var findLearnedCourses = courseCounter.getCoursesByIndexes(optionalCourses,indexes);
                course.status = courseCounter.getCoursePassStatus(findLearnedCourses);
            }else if(course.name ="選修課程"){
                var optionalCreditCounter = courseCounter.getCorusesPassCredit(optionalCourses,course.credit,"ME");
                if(optionalCreditCounter > course.credit){
                    course.status = "通過(" + optionalCreditCounter + ")";
                }else{
                    course.status = "未通過(" + optionalCreditCounter + ")";
                }
            }
        }
        //  optional overedCourses  => otherCourses
        for(let i=optionalCourses.length-1; i>=0 ; i--){
            var course = optionalCourses[i];
            if( !course.isCounted ){
                var courseCopy = {};
                $.extend(courseCopy,course);
                optionalCourses.splice(i,1);
                courseCounter.classifiedCourses.otherCourses.push( courseCopy );
            }
        }


        var literatureCourses = courseCounter.classifiedCourses.literatureCourses;
        var PECourses = courseCounter.classifiedCourses.PECourses;
        var commonCourses = courseCounter.classifiedCourses.commonCourses;

        // common overed Courses => otherCourses
        (function(coursesArray){
            coursesArray.forEach(function(courses){
                for(let i=0 ; i<courses.length ; i++){
                    var course = courses[i];
                    if( !course.isCounted ){
                        var courseCopy = {};
                        $.extend(courseCopy,course);
                        obligatoryCourses.splice(i,1);
                        courseCounter.classifiedCourses.otherCourses.push( courseCopy );
                    }
                }
            })
        })( [literatureCourses,PECourses,commonCourses] );

        // check other
        var graduationCourses = courseCounter.otherCourses;
        var otherCourses = courseCounter.classifiedCourses.otherCourses;
        for(let i=0 ;i<graduationCourses.length;i++){
            var course = graduationCourses[i];
            if(course.name ==  "自由選修課程" ){
                var optionalCreditCounter = courseCounter.getCorusesPassCredit(otherCourses,100);
                if(optionalCreditCounter > course.credit){
                    course.status = "通過(" + optionalCreditCounter + ")";
                }else{
                    course.status = "未通過(" + optionalCreditCounter + ")";
                }
            }
        }
    }
}


courseCounter.obligatoryCourses = courseCounter.mergeObligatoryCourse(courses.major.course);
courseCounter.optionalCourses = courses.major.course.optional;
courseCounter.otherCourses = courses.major.course.other;
courseCounter.learnedCourses = courseCounter.parserCourses();
courseCounter.classifiedCourses = courseCounter.classifyParserCourse( courseCounter.learnedCourses );
courseCounter.checkGraduationCredit();

view.addPageContent();
view.updateGraduationCredit();
view.addCleanPageContent();
view.updateCleanPagContente();


