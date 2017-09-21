function copyObjectedArray( array ){
    var newArray = [];
    for(var i=0 ; i<array.length ; i++){
        var newItem = {};
        $.extend(newItem,array[i]);
        newArray.push(newItem);
    }
    return newArray; 
}
function ObjectIndexOf(obj,objArray,checkKeys,startIndex,isNeedSame){
    if(startIndex==undefined)startIndex=0;
    for(let i=startIndex ; i<objArray.length ; i++){
        var checkObj = objArray[i];
        var successCheckCounter = 0;
        
        checkKeys.forEach(function(key){
            if( typeof(obj[key]) == "string" &&　!isNeedSame ){
                if(checkObj[key].indexOf(obj[key]) != -1 ){ 
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

function ObjectIndexOfAll(obj,objArray,checkKeys,isNeedSame){
    var indexes = [], i = -1;
    while ((i = ObjectIndexOf(obj,objArray,checkKeys,i+1,isNeedSame)) != -1){
        indexes.push(i);
    }
    return indexes;
}

var courseCounter = {
    majorCode:null,
    obligatoryCourses:null,
    optionalCourses:null,
    otherCourses:null,
    learnedCourses:null,
    classifiedCourses:null,
    mergeObligatoryCourse:function( dispersedCourse ){
        var mergeCourse = [];
        var years = ["FirstYear","SecondYear","ThirdYear","FourthYear"];
        years.forEach(function( year ){
            
            var courses = dispersedCourse[year];
            courses.forEach(function(course){
                mergeCourse.push(course);
            })
        });
        return mergeCourse;
    },
    updateByEnglishEntranceExam:function(
        graduatedEnglishCourses,
        learnedEnglishCourses
    ){
        var courseIndex = ObjectIndexOf({name:"英文字彙與閱讀(一)"},learnedEnglishCourses,["name"]);
        var course = learnedEnglishCourses[courseIndex];
        if(course.grade == "免修"){
            graduatedEnglishCourses.push(
                {
                    name:"高階英文(會考通過)",
                    semester:0,
                    credit:2,
                    isSpecialCheck:true,
                    checkCode:"FE"
                }
            );
            graduatedEnglishCourses.push(
                {
                    name:"高階英文(會考通過)",
                    semester:0,
                    credit:2,
                    isSpecialCheck:true,
                    checkCode:"FE"
                }
            );
        }else{
            var courseIndex = ObjectIndexOf({name:"校定英文能力會考"},learnedEnglishCourses,["name"]);
            var course = learnedEnglishCourses[courseIndex];
            if(courseIndex == -1){
                graduatedEnglishCourses.splice(0,0,
                    {
                        name:"英文實務(會考未通過)",
                        semester:0,
                        credit:2,
                        isSpecialCheck:true,
                        checkWord:"英文實務"
                    }
                );
                courseCounter.classifiedCourses.otherCourses.push(
                    {
                        name:"英文實務(系統自動新增，因為新增必修且可抵自由學分)",
                        semester:0,
                        credit:2,
                        code:"",
                        grade:"抵免"
                    }
                );
            }else{
                graduatedEnglishCourses.splice(0,0,
                    {
                        name:"校定英文能力會考",
                        semester:0,
                        credit:2,
                    }
                );
            }
        }
    },
    getCoursePassStatus:function(courses,checkCredit){
        // 可能有重修，需多重判斷多個重複課程
        var status = "尚未修課";
        for(let i=0 ;i<courses.length ;i++){
            var course = courses[i];
            var grade = course.grade;
            if(course.isCounted){
                continue;
            }else{
                course.isCounted = true;
            }
            if( grade == "抵免"|| grade == "免修" || grade == "通過"){
                course.isCounted = true;
                return grade;
            }else if( checkCredit !=undefined && course.credit != checkCredit ){
                continue;
            }
            if(course.name == "尚未確認"){
                status = "尚未確認";
            }else if(grade.charCodeAt(0) <= "C".charCodeAt(0)){
                return "通過";
            }else{
                status = "未通過";
            }
        }
        return status;
    },
    getCorusesPassCredit:function(courses,targetCredit){
        var creditCounter = 0;
        for(let i=0;i<courses.length;i++){
            var course = courses[i];
            var grade = course.grade;
            if(creditCounter >= targetCredit){
                return creditCounter;
            }
            if(course.isCounted){
                continue;
            }else{
                course.isCounted = true;
            }
            if( grade.indexOf("抵免") != -1 || grade.indexOf("免修") != -1 ){
                creditCounter += course.credit;
            }else if(grade.charCodeAt(0) <= "C".charCodeAt(0)){
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
        var commonAllCourses = [];
        // find PE Courses
        for(let i=coursesCopy.length-1 ; i>= 0 ; i--){
            var course = coursesCopy[i];
            if(course.name.indexOf("體育") != -1){
                var courseCopy = {};
                $.extend(courseCopy,coursesCopy[i]);
                commonAllCourses.push( courseCopy );
                coursesCopy.splice(i,1);
            }
        }
        // find literatureCourses
        for(let i=coursesCopy.length-1 ; i>= 0 ; i--){
            var course = coursesCopy[i];
            if(course.code.indexOf("CC12") != -1){
                var courseCopy = {};
                $.extend(courseCopy,coursesCopy[i]);
                commonAllCourses.push( courseCopy );
                coursesCopy.splice(i,1);
            }
        }
        // find EnglishCourses
        var EnglishCourses = [];
        for(let i=coursesCopy.length-1 ; i>= 0 ; i--){
            var course = coursesCopy[i];
            // FE為高階英文   CC10為初階英文
            if(course.code.indexOf("FE") != -1 || course.code.indexOf("CC10") != -1 || course.name == "校定英文能力會考" ){
                var courseCopy = {};
                $.extend(courseCopy,coursesCopy[i]);
                EnglishCourses.push( courseCopy );
                coursesCopy.splice(i,1);
            }
        }

        // find obligatoryCourses  &&  optionalCourses    putIn obligatoryCourses first
        var obligatoryCourses = [];
        graduatedObligatoryCourses = courseCounter.obligatoryCourses;
        for(let i=0; i<graduatedObligatoryCourses.length ; i++){
            var graduatedObligatoryCourse = graduatedObligatoryCourses[i];
            for( let j=coursesCopy.length-1 ; j>=0 ; j--){
                // 因為可能重修或同名所以遍布完全部
                var course = coursesCopy[j];
                if(!graduatedObligatoryCourse.isSpecialCheck){
                    if(course.name == graduatedObligatoryCourse.name){

                        var courseCopy = {};
                        $.extend(courseCopy,coursesCopy[j]);
                        obligatoryCourses.push( courseCopy );
                        coursesCopy.splice(j,1);
                    }
                }else{
                    var checkWord = graduatedObligatoryCourse.checkWord;
                    var checkCode = graduatedObligatoryCourse.checkCode;
                    if(checkWord != undefined){
                        if(typeof(checkWord) == "object" ){
                            checkWord.forEach(function(word){
                                if(course.name.indexOf( word ) != -1){
                                    var courseCopy = {};
                                    $.extend(courseCopy,coursesCopy[j]);
                                    obligatoryCourses.push( courseCopy );
                                    coursesCopy.splice(j,1);
                                }
                            });
                        }else if(course.name.indexOf( checkWord) != -1){
                            var courseCopy = {};
                            $.extend(courseCopy,coursesCopy[j]);
                            obligatoryCourses.push( courseCopy );
                            coursesCopy.splice(j,1);
                        }
                    }else if(checkCode != undefined){
                        if(typeof(checkCode) == "object" ){
                            checkCode.forEach(function(code){
                                if(course.name.indexOf( code ) != -1){
                                    var courseCopy = {};
                                    $.extend(courseCopy,coursesCopy[j]);
                                    obligatoryCourses.push( courseCopy );
                                    coursesCopy.splice(j,1);
                                }
                            });
                        }else if(course.name.indexOf( checkCode) != -1){
                            var courseCopy = {};
                            $.extend(courseCopy,coursesCopy[j]);
                            obligatoryCourses.push( courseCopy );
                            coursesCopy.splice(j,1);
                        }
                    }
                }
            }
        }

        for(let i=coursesCopy.length-1 ; i>= 0 ; i--){
            var course = coursesCopy[i];
            // find Common Course
            if(course.category != null ||
                course.code[2] == "G" ||
                course.code.indexOf("SA") != -1
            ){
                var courseCopy = {};
                $.extend(courseCopy,coursesCopy[i]);
                commonAllCourses.push( courseCopy );
                coursesCopy.splice(i,1);
            }
        }

        for(let i=coursesCopy.length-1 ; i>= 0 ; i--){
            var course = coursesCopy[i];
            if(course.code.indexOf( courseCounter.majorCode ) != -1){
                var courseCopy = {};
                $.extend(courseCopy,coursesCopy[i]);
                obligatoryCourses.push( courseCopy );
                coursesCopy.splice(i,1);
            }
        }
        
        // otherCourse
        var otherCourses = coursesCopy;
        return {
            "commonAllCourses":commonAllCourses,
            "EnglishCourses":EnglishCourses,
            "obligatoryCourses":obligatoryCourses,
            "optionalCourses":[],
            "otherCourses":otherCourses
        }
    },
    checkGraduationCredit:function(){

        // 判斷英文門檻
        courseCounter.updateByEnglishEntranceExam(
            courseCounter.EnglishCourses,
            courseCounter.classifiedCourses.EnglishCourses,
        );
        
        var checkCoursesArray = [
            // check English
            [   
                courseCounter.EnglishCourses ,
                courseCounter.classifiedCourses.EnglishCourses ,
                courseCounter.classifiedCourses.otherCourses
            ],
            // check obligatory 
            [
                courseCounter.obligatoryCourses ,
                courseCounter.classifiedCourses.obligatoryCourses ,
                courseCounter.classifiedCourses.optionalCourses
            ],
            // chekc optional
            [
                courseCounter.optionalCourses,
                courseCounter.classifiedCourses.optionalCourses,
                courseCounter.classifiedCourses.otherCourses
            ],
            // check common
            [
                courses.common.course,
                courseCounter.classifiedCourses.commonAllCourses,
                courseCounter.classifiedCourses.otherCourses
            ]
        ]

        checkCoursesArray.forEach(function(checkCourses){
            if(checkCourses.indexOf(undefined) != -1)return;
            (function checkCourse(graduationCourses,learnedCourses,overToCourses){
                for(let i=0 ;i<graduationCourses.length;i++){
                    var course = graduationCourses[i];
                    if( course.isSpecialCheck == undefined){
                        var indexes = ObjectIndexOfAll(course,learnedCourses,["name"],true);
                        var findLearnedCourses = courseCounter.getCoursesByIndexes(learnedCourses,indexes);
                        var checkCredit = course.credit;
                        course.status = courseCounter.getCoursePassStatus(findLearnedCourses,checkCredit);
                    }else{
                        if(course.checkWord != undefined){
                            if(typeof(course.checkWord) == "string"){
                                var indexes = ObjectIndexOfAll({name:course.checkWord},learnedCourses,["name"]);
                                var findLearnedCourses = courseCounter.getCoursesByIndexes(learnedCourses,indexes);
                                var checkCredit = course.credit;
                                course.status = courseCounter.getCoursePassStatus(findLearnedCourses,checkCredit);
                            }else{
                                for(let j=0 ; j<course.checkWord.length ; j++){
                                    var checkWord = course.checkWord[j];
                                    var indexes = ObjectIndexOfAll({name:checkWord},learnedCourses,["name"]);
                                    var findLearnedCourses = courseCounter.getCoursesByIndexes(learnedCourses,indexes);
                                    var checkCredit = course.crefit;
                                    course.status = courseCounter.getCoursePassStatus(findLearnedCourses,checkCredit);
                                    if(course.status == "通過")break;
                                }
                            }
                        }else if(course.checkCode != undefined){
                            if(typeof(course.checkCode) == "string"){
                                var indexes = ObjectIndexOfAll({code:course.checkCode},learnedCourses,["code"]);
                                var findLearnedCourses = courseCounter.getCoursesByIndexes(learnedCourses,indexes);
                                var checkCredit = course.crefit;
                                course.status = courseCounter.getCoursePassStatus(findLearnedCourses,checkCredit);
                            }else{
                                for(let j=0 ; j<course.checkCode.length ; j++){
                                    var checkCode = course.checkCode[j];
                                    var indexes = ObjectIndexOfAll({code:checkCode},learnedCourses,["code"]);
                                    var findLearnedCourses = courseCounter.getCoursesByIndexes(learnedCourses,indexes);
                                    var checkCredit = course.crefit;
                                    course.status = courseCounter.getCoursePassStatus(findLearnedCourses,checkCredit);
                                    if(course.status == "通過")break;
                                }
                            }
                        }else if(course.checkCategory != undefined){
                            var indexes = ObjectIndexOfAll({category:course.checkCategory},learnedCourses,["category"],true);
                            var findLearnedCourses = courseCounter.getCoursesByIndexes(learnedCourses,indexes);
                            var checkCredit = course.crefit;    
                            course.status = courseCounter.getCoursePassStatus(findLearnedCourses,checkCredit);
                        }else{
                            var CreditCounter = courseCounter.getCorusesPassCredit(learnedCourses,course.credit);
                            if(CreditCounter >= course.credit){
                                course.status = "通過(" + CreditCounter + ")";
                                var overCredit = CreditCounter - course.credit;
                                if(overCredit > 0){
                                    overToCourses.push( {
                                        name: course.name + "(超出學分)",
                                        credit : overCredit,
                                        grade : "抵免"
                                    } );
                                }
                            }else{
                                course.status = "未通過(" + CreditCounter + ")";
                            }
                        }
                    }
                }

                for(let i=learnedCourses.length-1 ; i>=0; i--){
                    var course = learnedCourses[i];
                    if( !course.isCounted ){
                        var courseCopy = {};
                        $.extend(courseCopy,course);
                        learnedCourses.splice(i,1);
                        overToCourses.push( courseCopy );
                    }
                }

            })(
                checkCourses[0],
                checkCourses[1],
                checkCourses[2],
            )
        })

        // check other
        var graduationCourses = courseCounter.otherCourses;
        var otherCourses = courseCounter.classifiedCourses.otherCourses;
        for(let i=0 ;i<graduationCourses.length;i++){
            var course = graduationCourses[i];
            var optionalCreditCounter = courseCounter.getCorusesPassCredit(otherCourses);
            if(optionalCreditCounter >= course.credit){
                course.status = "通過(" + optionalCreditCounter + ")";
            }else{
                course.status = "未通過(" + optionalCreditCounter + ")";
            }
        }
    }
}

courseCounter.majorCode = courses.major.code;
courseCounter.EnglishCourses = courses.English.course;
courseCounter.obligatoryCourses = courseCounter.mergeObligatoryCourse(courses.major.course);
courseCounter.optionalCourses = courses.major.course.optional;
courseCounter.otherCourses = courses.major.course.other;
courseCounter.learnedCourses = courseCounter.parserCourses();
courseCounter.classifiedCourses = courseCounter.classifyParserCourse( courseCounter.learnedCourses );
courseCounter.checkGraduationCredit();

view.addShortagedCouresPages();
view.addGraduatedCouresPages();
view.updateGraduationCredit();
view.addLearnedCouresPages();
view.updateLearnedCoures();