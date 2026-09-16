# Dubai Abaya Luxe

​💡 وصف المشروع:

إنشاء واجهة أمامية (Front-end) لمتجر إلكتروني فاخر ومتطور متخصص في العبايات والجلابيات تحت اسم "Dubai Abaya". الهدف هو تقديم تجربة بصرية مذهلة، حديثة، وبسيطة (Minimalist)، مستوحاة من فخامة الموضة في دبي، مع دمج لمسات ثلاثية الأبعاد (3D) وحركات انتقالية سلسة (Smooth Animations).

​🎨 الهوية البصرية والجمالية (Visually Stunning & Modern):

​لوحة الألوان: الاعتماد على درجات اللافندر والبنفسجي الهادئ وFairy Dust (المستوحاة من الشعار، مثل #B19CD9 و #E6E6FA) كمفتاح لوني. دمجها بذكاء مع خلفيات بيضاء نقية (#FFFFFF) لمظهر نظيف، واستخدام تدرجات لونية ناعمة (Subtle Gradients) ورماديات دافئة للنصوص.

​الأسلوب التصميمي: نهج Glassmorphism (تأثير الزجاج الضبابي) للبطاقات والقوائم، مع حواف ناعمة ودائرية (Soft Corners)، وظلال عميقة وناعمة (Deep Soft Shadows) لإعطاء إحساس بالعمق والطبقات (Neumorphism elements).

​الخطوط: استخدام خطوط سان سريف (Sans-serif) عصرية وواضحة وطباعة فخمة (Typographic hierarchy).

​✨ الحركات والتأثيرات ثلاثية الأبعاد (3D & Motion Features):

​الصفحة الرئيسية (Hero Section):

​عنصر بصري مركزي عبارة عن شعار "Dubai Abaya" المطور (من الصورة الأصلية) معاد هندسته كعنصر ثلاثي الأبعاد (3D Model rendering). يجب أن يدور ببطء ونعومة عند التمرير (Hover)، مع انعكاسات ضوئية زجاجية وبنفسجية.

​نص ترحيبي يظهر بحركة "تلاشي وانزلاق" (Fade-and-slide) أنيقة.

​معرض المنتجات (Product Grid):

​عند مرور الماوس (Hover) على بطاقة المنتج، يتم تطبيق تأثير ميلان ثلاثي الأبعاد (3D Tilt effect) يتتبع حركة المؤشر، مما يجعل المنتج يبدو وكأنه يطفو.

​إظهار زر "إضافة للسلة" بحركة سريعة ومقنعة (Snappy Animation).

​الانتقالات بين الصفحات (Page Transitions): انتقالات كاملة سلسة وغير منقطعة (Seamless single-page application feel) بين الأقسام، مثل تأثير "كشف القناع" (Mask reveal) أو "الباب الدوار الزجاجي".

​عناصر عائمة (Floating Elements): جزئيات ثلاثية الأبعاد صغيرة (Particles) عبارة عن لآلئ أو قطع قماش حريرية عائمة ببطء في الخلفية، تتفاعل مع حركة التمرير.

​📱 التجاوب والمرونة (Responsive & Interactive):

​التجاوب: الواجهة يجب أن تكون مصممة برؤية "الجوال أولاً" (Mobile-first)، مع الحفاظ على كافة التأثيرات ثلاثية الأبعاد والحركات بشكل محسن لللمس.

​التفاعلية: كل زر، قائمة، أو حقل إدخال يجب أن يحتوي على حالة Hover وحالة Active مصممة بعناية (مثال: نبضة لونية ناعمة أو تضخم طفيف).

​💻 المتطلبات التقنية للتصميم (Implementation Notes):

​الهيكل: HTML5 نظيف ودلالي.

​التنسيق والحركة: استخدام CSS3 متطور، Tailwind CSS (للسرعة والنظافة)، و Framer Motion (أوGSAP) لإدارة الحركات المعقدة والثلاثية الأبعاد بدقة.

​الثلاثية الأبعاد: دمج عناصر ثلاثية الأبعاد باستخدام مكتبات مثل React Three Fiber أو Spline (لجلب النماذج الجاهزة) وتفاعلها مع التمرير والماوس.

​🎯 الهدف النهائي:

واجهة لا تبدو كمتجر عادي، بل كمعرض فني رقمي فاخر للعبايات، يأسر عين العميل بجمال الألوان وسلاسة الحركات ويمنحه إحساساً بالفخامة والتميز.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dubai-abaya-sparkle.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ab8b9156-676b-44f6-a1d4-9b1cb2209a65).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
