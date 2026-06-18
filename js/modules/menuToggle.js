export function initSidebar(){

  const $menuBtn = $(".header-btn-menu");
  const $sidebar = $(".sidebar");
  const $overlay = $(".sidebar-overlay");
  const $close = $(".sidebar-close");

  console.log("메뉴버튼", $menuBtn.length);
  console.log("사이드바", $sidebar.length);

  if(!$sidebar.length) return;

  $menuBtn.off("click").on("click",function(){
    console.log("열림");
    $sidebar.addClass("active");
    $overlay.addClass("active");
  });

  $close.off("click").on("click",function(){
    closeSidebar();
  });

  $overlay.off("click").on("click",function(){
    closeSidebar();
  });

  $(document).off("keydown").on("keydown",function(e){
    if(e.key === "Escape"){
      closeSidebar();
    }
  });

  function closeSidebar(){
    $sidebar.removeClass("active");
    $overlay.removeClass("active");
  }
}