import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function AccordionUsage() {
  return (
    <div className="w-full flex flex-col items-center gap-8 py-16 text-white">

      {/* Heading */}
      <h1 className="text-5xl sm:text-6xl font-semibold text-center mb-10" style={{ color: '#ffffff' }}>
        Frequently Asked Questions
      </h1>

      {/* Accordion Container */}
      <div className="w-full max-w-2xl space-y-4">

        {/* Accordion 1 */}
        <Accordion
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography sx={{ color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>What is StickX?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: "#e5e5e5", fontFamily: "'Inter', sans-serif" }}>
          StickX is a platform that lets you browse, create, and instantly post stickers on X. All stickers automatically have a black background and white border, so they’re ready to use.
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography sx={{ color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>Do I need an account to use StickX?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: "#e5e5e5", fontFamily: "'Inter', sans-serif" }}>
          No account is required to browse stickers or create your own. Signing up is optional if we later add features like favorites or custom packs.
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography sx={{ color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>Do you store my images?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: "#e5e5e5", fontFamily: "'Inter', sans-serif" }}>
          Images are temporarily processed for creating stickers but are not stored permanently , only if you allowed  ,  Privacy is respected  , 
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography sx={{ color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>Can I use StickX on mobile?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: "#e5e5e5", fontFamily: "'Inter', sans-serif" }}>
          Yes! StickX is fully mobile-friendly. You can browse, create, and post stickers directly from your phone.
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography sx={{ color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>How do you make the stickers black background + white border</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: "#e5e5e5", fontFamily: "'Inter', sans-serif" }}>
          We use an automatic processing pipeline that adds a black background behind your image and a crisp white outline — no manual editing needed.
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography sx={{ color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>How do you ensure stickers look good on X feeds?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: "#e5e5e5", fontFamily: "'Inter', sans-serif" }}>
          Stickers are processed to maintain contrast, clarity, and visibility on both light and dark modes. We also optimize dimensions to avoid cropping or distortion.
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography sx={{ color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>Can a company or brand create their own sticker packs on StickX?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: "#e5e5e5", fontFamily: "'Inter', sans-serif" }}>
          Yes! Companies can design stickers using ‘Create Sticker’. For bulk or branded packs, contact us creation2224@gmail.com.
          </AccordionDetails>
        </Accordion>



        {/* Accordion 2 */}
        <Accordion
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography sx={{ color: "#ffffff", fontFamily: "'Inter', sans-serif" }}>Is StickX free?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ color: "#e5e5e5", fontFamily: "'Inter', sans-serif" }}>
            Yes! All basic sticker-generation features are completely free.
          </AccordionDetails>
        </Accordion>

      </div>
    </div>
  );
}
